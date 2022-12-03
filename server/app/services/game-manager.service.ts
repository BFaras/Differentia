/* eslint-disable max-lines */
import {
    GAME_WON,
    IT_IS_MULTIPLAYER,
    NOBODY_ABANDONNED,
    NO_AVAILABLE,
    NO_MORE_GAMES_AVAILABLE,
    ONE_SECOND_DELAY,
    TIMER_HIT_ZERO,
} from '@app/server-consts';
import { AbandonData } from '@common/abandon-data';
import {
    CLASSIC_MODE,
    DEFAULT_GAME_ROOM_NAME,
    EMPTY_ARRAY_LENGTH,
    GAME_ROOM_GENERAL_ID,
    LIMITED_TIME_MODE,
    MODIFIED_IMAGE_POSITION,
    NO_OTHER_PLAYER_ROOM,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameInfo } from '@common/gameInfo';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import * as io from 'socket.io';
import { Container, Service } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { ClueManagerService } from './clue-manager.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';

@Service()
export class GameManagerService {
    gamesRooms: Map<string, string[]> = new Map<string, string[]>();
    allSocketsRooms: string[] = [];
    private readonly timeIntervals: Map<string, NodeJS.Timer> = new Map<string, NodeJS.Timer>();
    private readonly chronometerServices: Map<string, ChronometerService> = new Map<string, ChronometerService>();
    private readonly mouseHandlerServices: Map<string, MouseHandlerService> = new Map<string, MouseHandlerService>();
    private readonly gamesPlayedByRoom: Map<string, string[]> = new Map<string, string[]>();
    private gamesService = Container.get(GamesService);
    private clueManagerService: ClueManagerService;

    constructor(private sio: io.Server) {
        this.clueManagerService = Container.get(ClueManagerService);
    }

    async beginGame(gameInfo: GameInfo) {
        this.setupSocketGameRoom(gameInfo.socket, NO_OTHER_PLAYER_ROOM);
        await this.setupNecessaryGameServices(gameInfo.socket, gameInfo.gameMode);
        await this.getSocketMouseHandlerService(gameInfo.socket).generateDifferencesInformations(gameInfo.gameName);
        this.clueManagerService.resetSocketClueAmount(gameInfo.socket);
        this.getSocketMouseHandlerService(gameInfo.socket).addPlayerToGame(gameInfo.socket.id);
        const gameRoomName = this.findSocketGameRoomName(gameInfo.socket);

        if (gameInfo.adversarySocket) {
            this.setupSocketGameRoom(gameInfo.adversarySocket, gameRoomName);
            this.getSocketMouseHandlerService(gameInfo.adversarySocket).addPlayerToGame(gameInfo.adversarySocket.id);
            this.clueManagerService.resetSocketClueAmount(gameInfo.adversarySocket);
        }
        this.logRoomsWithGames(gameInfo.gameName, gameRoomName);
        await this.sendImagesToClient(gameInfo.gameName, gameInfo.socket);
    }

    async resetGameList() {
        return await this.gamesService.resetGameList();
    }

    async startMultiplayerMatch(gameInfo: GameInfo) {
        if (gameInfo.gameMode === CLASSIC_MODE) gameInfo.adversarySocket.emit(`${gameInfo.gameName} you have been accepted`);
        await this.beginGame(gameInfo);

        gameInfo.socket.emit('show the username', this.getSocketUsername(gameInfo.socket));
        gameInfo.adversarySocket.emit('show the username', this.getSocketUsername(gameInfo.adversarySocket));
        gameInfo.socket.emit('The adversary username is', this.getSocketUsername(gameInfo.adversarySocket));
        gameInfo.adversarySocket.emit('The adversary username is', this.getSocketUsername(gameInfo.socket));

        const gameRoomName = this.findSocketGameRoomName(gameInfo.socket);
        this.sio.to(gameRoomName).emit(gameInfo.gameMode);
        this.sio.to(gameRoomName).emit('The game is', gameInfo.gameName);
    }

    endGame(socket: io.Socket, mode: string) {
        if (mode === CLASSIC_MODE) this.endGameWithDependencies(socket);
        else this.endGameWithDependencies(socket, !TIMER_HIT_ZERO, NO_MORE_GAMES_AVAILABLE);
    }

    clickResponse(socket: io.Socket, mousePosition: Position) {
        const differencesInfo: GameplayDifferenceInformations = this.getSocketMouseHandlerService(socket).isValidClick(mousePosition, socket.id);
        const gameRoomName = this.findSocketGameRoomName(socket);
        const chronometerService: ChronometerService = this.getRoomChronometerService(gameRoomName);
        differencesInfo.socketId = socket.id;
        differencesInfo.playerUsername = this.getSocketUsername(socket);
        if (differencesInfo.isValidDifference) chronometerService.increaseTimeByBonusTime();
        this.sio.to(this.findSocketGameRoomName(socket)).emit('Valid click', differencesInfo);
    }

    async isGameFinished(socket: io.Socket, isItMultiplayer: boolean, mode: string): Promise<boolean> {
        if (mode === CLASSIC_MODE) return this.classicIsGameFinished(socket, isItMultiplayer);
        else return await this.limitedTimeIsGameFinished(socket);
    }

    sendDifferentPixelsNotFound(socket: io.Socket) {
        const differentPixel: number[] = this.getSocketMouseHandlerService(socket).getDifferentPixelListNotFound();
        socket.emit('Cheat pixel list', differentPixel);
    }

    isGameFinishedSolo(socket: io.Socket) {
        const mouseHandler = this.getSocketMouseHandlerService(socket);
        return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal;
    }

    isGameFinishedMulti(socket: io.Socket) {
        const mouseHandler = this.getSocketMouseHandlerService(socket);

        if (mouseHandler.nbDifferencesTotal % 2 !== 0) {
            return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === Math.floor(mouseHandler.nbDifferencesTotal / 2) + 1;
        } else {
            return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal / 2 - 1;
        }
    }

    // Test à modifier?
    handleEndGameEmits(socket: io.Socket, isItMultiplayer: boolean, hasNewRecord: boolean, playerRanking: number) {
        const endGameInfos: EndGameInformations = {
            isMultiplayer: isItMultiplayer,
            isAbandon: NOBODY_ABANDONNED,
            isGameWon: GAME_WON,
            hasNewRecord: hasNewRecord,
            playerRanking: playerRanking,
        };
        socket.emit('End game', endGameInfos);

        endGameInfos.isGameWon = !GAME_WON;
        this.deleteRoom(socket);
        socket.broadcast.to(this.findSocketGameRoomName(socket)).emit('End game', endGameInfos);
    }

    handleAbandonEmit(socket: io.Socket, abandonInfo: AbandonData) {
        const gameRoomName = this.findSocketGameRoomName(socket);
        let endGameInfos: EndGameInformations;
        if (abandonInfo.gameMode === CLASSIC_MODE) {
            endGameInfos = {
                isMultiplayer: IT_IS_MULTIPLAYER,
                isAbandon: !NOBODY_ABANDONNED,
                isGameWon: GAME_WON,
                hasNewRecord: false,
                playerRanking: NO_AVAILABLE,
            };
            this.sio.to(gameRoomName).emit('End game', endGameInfos);
            this.endGame(socket, abandonInfo.gameMode);
        } else {
            this.sio.in(gameRoomName).emit('Other player abandonned LM');

            if (!abandonInfo.isMultiplayerMatch) {
                this.endGame(socket, abandonInfo.gameMode);
            }
        }
    }

    findSocketGameRoomName(socket: io.Socket): string {
        let gameRoomName = DEFAULT_GAME_ROOM_NAME;
        socket.rooms.forEach((roomName: string) => {
            if (roomName.includes(GAME_ROOM_GENERAL_ID)) {
                gameRoomName = roomName;
            }
        });
        return gameRoomName;
    }

    // To test
    getSocketMouseHandlerService(socket: io.Socket): MouseHandlerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.mouseHandlerServices.get(gameRoomName) as MouseHandlerService;
    }

    getGameRooms(): Map<string, string[]> {
        return this.gamesRooms;
    }

    initializeSocketGameHistoryLimitedTimeMode(socket: io.Socket): void {
        this.gamesPlayedByRoom.set(this.findSocketGameRoomName(socket), []);
    }

    addGameToHistoryLimitedTimeMode(socket: io.Socket, gameName: string): void {
        this.gamesPlayedByRoom.get(this.findSocketGameRoomName(socket))!.push(gameName);
    }

    getSocketChronometerService(socket: io.Socket): ChronometerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.chronometerServices.get(gameRoomName) as ChronometerService;
    }

    async doWeHaveToSwitchGame(socket: io.Socket, mode: string, adversarySocket?: io.Socket): Promise<void> {
        if (mode === LIMITED_TIME_MODE) await this.switchGame(socket, adversarySocket);
    }

    endGameWithDependencies(socket: io.Socket, hasTheTimerHitZero?: boolean, noMoreGames?: boolean) {
        const gameRoomName: string = this.findSocketGameRoomName(socket);
        this.endChrono(socket);
        this.chronometerServices.delete(gameRoomName);
        this.mouseHandlerServices.delete(gameRoomName);
        this.timeIntervals.delete(gameRoomName);
        this.eraseGamesFromHistoryLimitedTimeMode(socket);
        if (hasTheTimerHitZero) this.sio.to(gameRoomName).emit('time hit zero');
        if (noMoreGames) this.sio.to(gameRoomName).emit('no more games available');
        this.sio.in(gameRoomName).socketsLeave(gameRoomName);
    }

    collectAllSocketsRooms(): string[] {
        for (const rooms of this.getGameRooms().entries()) {
            if (this.allSocketsRooms.length === 0)
                rooms[1].forEach((room) => {
                    this.allSocketsRooms.push(room);
                });
            else this.allSocketsRooms = this.allSocketsRooms.concat(rooms[1]);
        }
        return this.allSocketsRooms;
    }

    getSocketUsername(socket: io.Socket): string {
        return socket.data.username;
    }

    startLimitedTimeSocketGameHistory(socket: io.Socket, gameName: string) {
        this.initializeSocketGameHistoryLimitedTimeMode(socket);
        this.addGameToHistoryLimitedTimeMode(socket, gameName);
    }

    getSocketGameName(socket: io.Socket): string {
        const gameRoomName = this.findSocketGameRoomName(socket);
        let gameName = '';
        for (const rooms of this.gamesRooms.entries()) {
            rooms[1].forEach((value) => {
                if (value === gameRoomName) {
                    gameName = rooms[0];
                }
            });
        }
        return gameName;
    }

    //To test Seb
    private async switchGame(socket: io.Socket, adversarySocket?: io.Socket): Promise<void> {
        const gameToBePlayed = await this.gamesService.generateRandomGame(this.gamesPlayedByRoom.get(this.findSocketGameRoomName(socket))!);
        this.addGameToHistoryLimitedTimeMode(socket, gameToBePlayed.name);
        this.resetMouseHandlerService(socket, gameToBePlayed.name);
        if (adversarySocket) {
            this.addGameToHistoryLimitedTimeMode(adversarySocket, gameToBePlayed.name);
            this.resetMouseHandlerService(adversarySocket, gameToBePlayed.name);
        }
        await this.sendImagesToClient(gameToBePlayed.name, socket);
        this.sio.to(this.findSocketGameRoomName(socket)).emit('The game is', gameToBePlayed.name);
    }

    private async resetMouseHandlerService(socket: io.Socket, gameName: string) {
        const adversaryMouseHandlerService = this.getSocketMouseHandlerService(socket);
        adversaryMouseHandlerService.resetDifferencesData();
        await adversaryMouseHandlerService.generateDifferencesInformations(gameName);
    }

    private classicIsGameFinished(socket: io.Socket, isItMultiplayer: boolean): boolean {
        if (isItMultiplayer) return this.classicIsGameFinishedMultiplayer(socket);
        else return this.classicIsGameFinishedSolo(socket);
    }

    //To test Seb?
    private async limitedTimeIsGameFinished(socket: io.Socket): Promise<boolean> {
        return this.gamesPlayedByRoom.get(this.findSocketGameRoomName(socket))!.length === (await this.gamesService.getAllGames()).length;
    }

    private classicIsGameFinishedSolo(socket: io.Socket): boolean {
        const mouseHandler = this.getSocketMouseHandlerService(socket);
        return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal;
    }

    private classicIsGameFinishedMultiplayer(socket: io.Socket): boolean {
        const mouseHandler = this.getSocketMouseHandlerService(socket);

        if (mouseHandler.nbDifferencesTotal % 2 !== 0) {
            return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === Math.floor(mouseHandler.nbDifferencesTotal / 2) + 1;
        } else {
            return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal / 2 - 1;
        }
    }

    private eraseGamesFromHistoryLimitedTimeMode(socket: io.Socket): void {
        this.gamesPlayedByRoom.delete(this.findSocketGameRoomName(socket));
    }

    private async setupNecessaryGameServices(socket: io.Socket, gameMode: string) {
        const mouseHandler: MouseHandlerService = new MouseHandlerService();
        const chronometerService: ChronometerService = new ChronometerService();
        await chronometerService.setChronometerMode(gameMode, socket);
        const gameRoomName = this.findSocketGameRoomName(socket);
        this.sendFirstTime(gameRoomName, chronometerService);

        this.chronometerServices.set(gameRoomName, chronometerService);
        this.mouseHandlerServices.set(gameRoomName, mouseHandler);
        this.timeIntervals.set(
            gameRoomName,
            setInterval(() => {
                this.sendTime(socket, gameRoomName);
            }, ONE_SECOND_DELAY),
        );
    }

    private sendFirstTime(gameRoomName: string, chronometerService: ChronometerService) {
        this.sio.to(gameRoomName).emit('time', chronometerService.time);
    }

    private sendTime(socket: io.Socket, gameRoomName: string) {
        this.emitTime(this.getRoomChronometerService(gameRoomName), gameRoomName, socket);
    }

    private getRoomChronometerService(gameRoomName: string): ChronometerService {
        return this.chronometerServices.get(gameRoomName) as ChronometerService;
    }

    private logRoomsWithGames(gameName: string, roomName: string): void {
        const rooms: string[] = [];
        if (this.gamesRooms.has(gameName)) {
            this.gamesRooms.get(gameName)?.forEach((socketRoom) => {
                rooms.push(socketRoom);
            });
            rooms.push(roomName);
        } else {
            rooms.push(roomName);
        }
        this.gamesRooms.set(gameName, rooms);
    }

    deleteRoom(socket: io.Socket): void {
        const gameRoomName = this.findSocketGameRoomName(socket);
        let gameName = '';
        for (const rooms of this.gamesRooms.entries()) {
            rooms[1].forEach((value) => {
                if (value === gameRoomName) {
                    gameName = rooms[0];
                }
            });
        }
        const newRoom = this.gamesRooms.get(gameName)?.filter((socketRoom) => {
            return socketRoom !== gameRoomName;
        });

        if (newRoom) {
            this.gamesRooms.set(gameName, newRoom);
        }
        if (newRoom?.length === EMPTY_ARRAY_LENGTH) this.gamesRooms.delete(gameName);
    }

    private setupSocketGameRoom(socket: io.Socket, otherPlayerGameRoomId: string) {
        const playerGameRoomID = socket.id + GAME_ROOM_GENERAL_ID;

        if (otherPlayerGameRoomId === NO_OTHER_PLAYER_ROOM && !socket.rooms.has(playerGameRoomID)) {
            socket.join(playerGameRoomID);
        } else {
            socket.join(otherPlayerGameRoomId);
        }
    }

    private emitTime(chronometerService: ChronometerService, gameRoomName: string, socket: io.Socket) {
        if (chronometerService.mode === LIMITED_TIME_MODE && chronometerService.hasTheChronoHitZero()) {
            this.eraseGamesFromHistoryLimitedTimeMode(socket);
            this.endGameWithDependencies(socket, TIMER_HIT_ZERO);
        } else {
            chronometerService.changeTime();
            this.sio.to(gameRoomName).emit('time', chronometerService.time);
        }
    }

    private async sendImagesToClient(gameName: string, socket: io.Socket) {
        const gameImagesData: string[] = await this.gamesService.getGameImagesData(gameName);
        this.sio
            .to(this.findSocketGameRoomName(socket))
            .emit('game images', [gameImagesData[ORIGINAL_IMAGE_POSITION], gameImagesData[MODIFIED_IMAGE_POSITION]]);
    }

    private getSocketTimeInterval(socket: io.Socket): NodeJS.Timer {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.timeIntervals.get(gameRoomName) as NodeJS.Timer;
    }

    private endChrono(socket: io.Socket) {
        clearInterval(this.getSocketTimeInterval(socket));
        this.getSocketChronometerService(socket)?.resetChrono();
    }
}
