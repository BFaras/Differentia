import {
    CLASSIC_MODE,
    DEFAULT_GAME_ROOM_NAME,
    GAME_ROOM_GENERAL_ID,
    LIMITED_TIME_MODE,
    MODIFIED_IMAGE_POSITION,
    NO_OTHER_PLAYER_ROOM,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import * as io from 'socket.io';
import Container, { Service } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';
import { NO_MORE_GAMES_AVAILABLE, ONE_SECOND_DELAY, TIMER_HIT_ZERO } from '@app/server-consts';

@Service()
export class GameManagerService {
    gamesRooms: Map<string, string[]> = new Map<string, string[]>();
    private readonly timeIntervals: Map<string, NodeJS.Timer> = new Map<string, NodeJS.Timer>();
    private readonly chronometerServices: Map<string, ChronometerService> = new Map<string, ChronometerService>();
    private readonly mouseHandlerServices: Map<string, MouseHandlerService> = new Map<string, MouseHandlerService>();
    private gamesService = Container.get(GamesService);

    constructor(private sio: io.Server) {}

    async beginGame(socket: io.Socket, gameInfo: string[], adversarySocket?: io.Socket) {
        this.setupSocketGameRoom(socket, NO_OTHER_PLAYER_ROOM);
        this.setupNecessaryGameServices(socket, gameInfo[1]);
        await this.getSocketMouseHandlerService(socket).generateDifferencesInformations(gameInfo[0]);
        this.getSocketMouseHandlerService(socket).addPlayerToGame(socket.id);
        const gameRoomName = this.findSocketGameRoomName(socket);

        if (adversarySocket) {
            this.setupSocketGameRoom(adversarySocket, gameRoomName);
            this.getSocketMouseHandlerService(adversarySocket).addPlayerToGame(adversarySocket.id);
        }
        this.logRoomsWithGames(gameInfo[0], gameRoomName);

        await this.sendImagesToClient(gameInfo[0], socket);
    }

    async startMultiplayerMatch(socket: io.Socket, adversarySocket: io.Socket, gameInfo: string[]) {
        adversarySocket.emit(`${gameInfo[0]} you have been accepted`);
        await this.beginGame(socket, gameInfo, adversarySocket);
        socket.emit('show the username', this.getSocketUsername(socket));
        adversarySocket.emit('show the username', this.getSocketUsername(adversarySocket));
        socket.emit('The adversary username is', this.getSocketUsername(adversarySocket));
        adversarySocket.emit('The adversary username is', this.getSocketUsername(socket));

        const gameRoomName = this.findSocketGameRoomName(socket);
        this.sio.to(gameRoomName).emit(gameInfo[1]);
        this.sio.to(gameRoomName).emit('The game is', gameInfo[0]);
    }

    endGame(socket: io.Socket, mode: string) {
        if (mode === CLASSIC_MODE) this.endGameWithDependencies(socket);
        else this.endGameWithDependencies(socket, !TIMER_HIT_ZERO, NO_MORE_GAMES_AVAILABLE);
    }

    clickResponse(socket: io.Socket, mousePosition: Position) {
        const differencesInfo: GameplayDifferenceInformations = this.getSocketMouseHandlerService(socket).isValidClick(mousePosition, socket.id);
        differencesInfo.socketId = socket.id;
        differencesInfo.playerUsername = this.getSocketUsername(socket);
        this.sio.to(this.findSocketGameRoomName(socket)).emit('Valid click', differencesInfo);
    }

    async isGameFinished(socket: io.Socket, isItMultiplayer: boolean, mode: string): Promise<boolean> {
        if (mode === CLASSIC_MODE) return this.classicIsGameFinished(socket, isItMultiplayer);
        else return await this.limitedTimeIsGameFinished(socket);
    }

    handleEndGameEmits(socket: io.Socket, isItMultiplayer: boolean) {
        const endGameInfos: EndGameInformations = {
            isMultiplayer: isItMultiplayer,
            isAbandon: false,
            isGameWon: true,
        };
        socket.emit('End game', endGameInfos);

        endGameInfos.isGameWon = false;
        this.deleteRoom(socket);
        socket.broadcast.to(this.findSocketGameRoomName(socket)).emit('End game', endGameInfos);
    }

    handleAbandonEmit(socket: io.Socket, gameMode: string) {
        console.log('gameroom is ' + this.findSocketGameRoomName(socket));
        let endGameInfos: EndGameInformations;
        if (gameMode === CLASSIC_MODE) {
            this.endGame(socket, gameMode);
            endGameInfos = {
                isMultiplayer: true,
                isAbandon: true,
                isGameWon: true,
            };
            console.log('salut');
            socket.broadcast.to(this.findSocketGameRoomName(socket)).emit('End game', endGameInfos);
            this.deleteRoom(socket);
        } else {
            socket.broadcast.to(this.findSocketGameRoomName(socket)).emit('Other player abandonned LM', socket.data.username);
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

    getSocketMouseHandlerService(socket: io.Socket): MouseHandlerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.mouseHandlerServices.get(gameRoomName) as MouseHandlerService;
    }

    getGameRooms(): Map<string, string[]> {
        return this.gamesRooms;
    }

    initializeSocketGameHistoryLimitedTimeMode(socket: io.Socket): void {
        socket.data.gamesPlayed = [];
    }

    addGameToHistoryLimitedTimeMode(socket: io.Socket, gameName: string): void {
        socket.data.gamesPlayed.push(gameName);
    }

    getSocketChronometerService(socket: io.Socket): ChronometerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.chronometerServices.get(gameRoomName) as ChronometerService;
    }

    async doWeHaveToSwitchGame(socket: io.Socket, mode: string, adversarySocket?: io.Socket) {
        if (mode === LIMITED_TIME_MODE) await this.switchGame(socket, adversarySocket);
    }

    endGameWithDependencies(socket: io.Socket, hasTheTimerHitZero?: boolean, noMoreGames?: boolean) {
        const gameRoomName: string = this.findSocketGameRoomName(socket);
        this.endChrono(socket);
        this.chronometerServices.delete(gameRoomName);
        this.mouseHandlerServices.delete(gameRoomName);
        this.timeIntervals.delete(gameRoomName);
        if (hasTheTimerHitZero) this.sio.to(gameRoomName).emit('time hit zero');
        if (noMoreGames) this.sio.to(gameRoomName).emit('no more games available'); // À GÉRER DU CÔTÉ CLIENT
        this.sio.in(gameRoomName).socketsLeave(gameRoomName);
    }

    private async switchGame(socket: io.Socket, adversarySocket?: io.Socket): Promise<void> {
        const gameToBePlayed = await this.gamesService.generateRandomGame(socket.data.gamesPlayed);
        this.resetMouseHandlerService(socket, gameToBePlayed.name);
        if (adversarySocket) {
            this.resetMouseHandlerService(adversarySocket, gameToBePlayed.name);
        }
        await this.sendImagesToClient(gameToBePlayed.name, socket);
        this.sio.to(this.findSocketGameRoomName(socket)).emit('The game is', gameToBePlayed.name);
    }

    private async resetMouseHandlerService(socket: io.Socket, gameName: string) {
        this.addGameToHistoryLimitedTimeMode(socket, gameName);
        const adversaryMouseHandlerService = this.getSocketMouseHandlerService(socket);
        adversaryMouseHandlerService.resetDifferencesData();
        await adversaryMouseHandlerService.generateDifferencesInformations(gameName);
    }

    private classicIsGameFinished(socket: io.Socket, isItMultiplayer: boolean): boolean {
        let isGameFinished;
        if (isItMultiplayer) isGameFinished = this.classicIsGameFinishedMultiplayer(socket);
        else isGameFinished = this.classicIsGameFinishedSolo(socket);
        return isGameFinished;
    }

    private async limitedTimeIsGameFinished(socket: io.Socket): Promise<boolean> {
        return socket.data.gamesPlayed === (await this.gamesService.getAllGames()).length;
    }

    private classicIsGameFinishedSolo(socket: io.Socket) {
        const mouseHandler = this.getSocketMouseHandlerService(socket);
        return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal;
    }

    private classicIsGameFinishedMultiplayer(socket: io.Socket) {
        const mouseHandler = this.getSocketMouseHandlerService(socket);

        if (mouseHandler.nbDifferencesTotal % 2 !== 0) {
            return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === Math.floor(mouseHandler.nbDifferencesTotal / 2) + 1;
        } else {
            return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal / 2 - 1;
        }
    }

    private eraseGamesFromHistoryLimitedTimeMode(socket: io.Socket): void {
        socket.data.gamesPlayed = [];
    }

    private setupNecessaryGameServices(socket: io.Socket, gameMode: string) {
        const mouseHandler: MouseHandlerService = new MouseHandlerService();
        const chronometerService: ChronometerService = new ChronometerService();
        chronometerService.setChronometerMode(gameMode, socket);
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

    private deleteRoom(socket: io.Socket): void {
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
        if (newRoom?.length === 0) this.gamesRooms.delete(gameName);
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
        chronometerService.changeTime();
        this.sio.to(gameRoomName).emit('time', chronometerService.time);
        if (chronometerService.hasTheChronoHitZero()) {
            this.eraseGamesFromHistoryLimitedTimeMode(socket);
            this.endGameWithDependencies(socket, TIMER_HIT_ZERO);
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

    private getSocketUsername(socket: io.Socket) {
        return socket.data.username;
    }
}