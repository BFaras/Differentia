import { DEFAULT_GAME_ROOM_NAME, GAME_ROOM_GENERAL_ID, MODIFIED_IMAGE_POSITION, NO_OTHER_PLAYER_ROOM, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import * as io from 'socket.io';
import Container, { Service } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';

@Service()
export class GameManagerService {
    readonly timeIntervals: Map<string, NodeJS.Timer> = new Map<string, NodeJS.Timer>();
    readonly chronometerServices: Map<string, ChronometerService> = new Map<string, ChronometerService>();
    readonly mouseHandlerServices: Map<string, MouseHandlerService> = new Map<string, MouseHandlerService>();
    private gamesService = Container.get(GamesService);

    constructor(private sio: io.Server) {}

    async beginGame(socket: io.Socket, gameName: string, adversarySocket?: io.Socket) {
        this.setupSocketGameRoom(socket, NO_OTHER_PLAYER_ROOM);
        this.setupNecessaryGameServices(socket);

        await this.getSocketMouseHandlerService(socket).generateDifferencesInformations(gameName);
        this.getSocketMouseHandlerService(socket).addPlayerToGame(socket.id);

        if (adversarySocket) {
            this.setupSocketGameRoom(adversarySocket, this.findSocketGameRoomName(socket));
            this.getSocketMouseHandlerService(adversarySocket).addPlayerToGame(adversarySocket.id);
        }

        await this.sendImagesToClient(gameName, socket);
    }

    async startMultiplayerMatch(socket: io.Socket, adversarySocket: io.Socket, gameName: string) {
        adversarySocket.emit(`${gameName} you have been accepted`);
        await this.beginGame(socket, gameName, adversarySocket);

        socket.emit('show the username', this.getSocketUsername(socket));
        adversarySocket.emit('show the username', this.getSocketUsername(adversarySocket));
        socket.emit('The adversary username is', this.getSocketUsername(adversarySocket));
        adversarySocket.emit('The adversary username is', this.getSocketUsername(socket));

        const gameRoomName = this.findSocketGameRoomName(socket);
        this.sio.to(gameRoomName).emit('classic mode');
        this.sio.to(gameRoomName).emit('The game is', gameName);
    }

    endGame(socket: io.Socket) {
        const gameRoomName: string = this.findSocketGameRoomName(socket);
        this.endChrono(socket);
        this.chronometerServices.delete(gameRoomName);
        this.mouseHandlerServices.delete(gameRoomName);
        this.timeIntervals.delete(gameRoomName);
        socket.rooms.delete(gameRoomName);
    }

    clickResponse(socket: io.Socket, mousePosition: Position) {
        const differencesInfo: GameplayDifferenceInformations = this.getSocketMouseHandlerService(socket).isValidClick(mousePosition, socket.id);
        differencesInfo.playerName = this.getSocketUsername(socket);
        this.sio.to(this.findSocketGameRoomName(socket)).emit('Valid click', differencesInfo);
    }

    //To test
    isGameFinishedSolo(socket: io.Socket) {
        const mouseHandler = this.getSocketMouseHandlerService(socket);
        return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal;
    }

    //To test
    isGameFinishedMulti(socket: io.Socket) {
        const mouseHandler = this.getSocketMouseHandlerService(socket);
        return mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === Math.floor(mouseHandler.nbDifferencesTotal / 2) + 1;
    }

    //To test
    handleEndGameEmits(socket: io.Socket, isMultiplayer: boolean) {
        let endGameInfos: EndGameInformations = {
            isMultiplayer: isMultiplayer,
            isAbandon: false,
            isGameWon: true,
        };
        socket.emit('End game', endGameInfos);

        endGameInfos.isGameWon = false;
        socket.broadcast.to(this.findSocketGameRoomName(socket)).emit('End game', endGameInfos);
    }

    private setupNecessaryGameServices(socket: io.Socket) {
        const mouseHandler: MouseHandlerService = new MouseHandlerService();
        const chronometerService: ChronometerService = new ChronometerService();

        const gameRoomName = this.findSocketGameRoomName(socket);

        this.chronometerServices.set(gameRoomName, chronometerService);
        this.mouseHandlerServices.set(gameRoomName, mouseHandler);
        this.timeIntervals.set(
            gameRoomName,
            setInterval(() => {
                this.emitTime(socket, this.getSocketChronometerService(socket), gameRoomName);
            }, 1000),
        );
    }

    private setupSocketGameRoom(socket: io.Socket, otherPlayerGameRoomId: string) {
        const playerGameRoomID = socket.id + GAME_ROOM_GENERAL_ID;

        if (otherPlayerGameRoomId === NO_OTHER_PLAYER_ROOM && !socket.rooms.has(playerGameRoomID)) {
            socket.join(playerGameRoomID);
        } else {
            socket.join(otherPlayerGameRoomId);
        }
    }

    private findSocketGameRoomName(socket: io.Socket): string {
        let gameRoomName = DEFAULT_GAME_ROOM_NAME;
        socket.rooms.forEach((roomName: string) => {
            if (roomName.includes(GAME_ROOM_GENERAL_ID)) {
                gameRoomName = roomName;
            }
        });

        return gameRoomName;
    }

    private emitTime(socket: io.Socket, chronometerService: ChronometerService, gameRoomName: string) {
        chronometerService.increaseTime();
        this.sio.to(gameRoomName).emit('time', chronometerService.time);
    }

    private async sendImagesToClient(gameName: string, socket: io.Socket) {
        const gameImagesData: string[] = await this.gamesService.getGameImagesData(gameName);

        this.sio
            .to(this.findSocketGameRoomName(socket))
            .emit('game images', [gameImagesData[ORIGINAL_IMAGE_POSITION], gameImagesData[MODIFIED_IMAGE_POSITION]]);
    }

    private getSocketChronometerService(socket: io.Socket): ChronometerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.chronometerServices.get(gameRoomName)!;
    }

    getSocketMouseHandlerService(socket: io.Socket): MouseHandlerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.mouseHandlerServices.get(gameRoomName)!;
    }

    private getSocketTimeInterval(socket: io.Socket): NodeJS.Timer {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.timeIntervals.get(gameRoomName)!;
    }

    private endChrono(socket: io.Socket) {
        clearInterval(this.getSocketTimeInterval(socket));
        this.getSocketChronometerService(socket)?.resetChrono();
    }

    private getSocketUsername(socket: io.Socket) {
        return socket.data.username;
    }
}
