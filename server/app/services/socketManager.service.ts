import { GamesService } from '@app/services/local.games.service';
import { DEFAULT_GAME_ROOM_NAME, GAME_ROOM_GENERAL_ID, MODIFIED_IMAGE_POSITION, NO_OTHER_PLAYER_ROOM, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { DifferencesInformations } from '@common/differences-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import * as http from 'http';
import * as io from 'socket.io';
import Container from 'typedi';
import { ChronometerService } from './chronometer.service';
import { DifferenceDetectorService } from './difference-detector.service';
import { MouseHandlerService } from './mouse-handler.service';

export class SocketManager {
    private sio: io.Server;
    // private room: string = "serverRoom";
    public socket: io.Socket;
    readonly timeIntervals: Map<string, NodeJS.Timer> = new Map<string, NodeJS.Timer>();
    readonly chronometerServices: Map<string, ChronometerService> = new Map<string, ChronometerService>();
    readonly mouseHandlerServices: Map<string, MouseHandlerService> = new Map<string, MouseHandlerService>();
    private playersCreatingAGame: Map<string, string> = new Map<string, string>();
    private playersJoiningAGame: Map<string, string[]> = new Map<string, string[]>();
    private gamesService = Container.get(GamesService);

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] }, maxHttpBufferSize: 1e7 });
    }

    public handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            this.socket = socket;

            socket.on('message', (message: string) => {
                console.log(message);
            });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('solo classic mode', async (gameName: string) => {
                socket.emit('classic mode');
                socket.emit('The game is', gameName);
                const username = this.getUsernamePlayer(socket.id);
                socket.emit('show the username', username);
                await this.beginGame(socket, gameName);
            });

            socket.on('is there someone waiting', (gameName: string) => {
                socket.emit(`${gameName} let me tell you if someone is waiting`, this.playersCreatingAGame.get(gameName) !== undefined);
            });

            socket.on('my username is', (username: string) => {
                this.setUsernamePlayer(socket.id, username);
            });

            socket.on('I am waiting', (gameName: string) => {
                this.playersCreatingAGame.set(gameName, socket.id);
                this.sio.emit(`${gameName} someone is waiting`);
            });

            socket.on('I left', (gameName: string) => {
                this.deleteCreatorOfGame(gameName);
                // Cette boucle for devrait être dans un service pour gérer le multijoueur du côté serveur ET le if est pt inutile
                if (this.playersJoiningAGame.get(gameName)?.length) {
                    const playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
                    for (const player of playersWaiting) {
                        //Mettre ce false dans une constante appellée genre HOST_LEFT = false;
                        this.sio.to(player).emit(`${gameName} response on host presence`, false);
                    }
                }
                this.sio.emit(`${gameName} nobody is waiting no more`);
            });

            socket.on(`Is the host still there`, (gameName: string) => {
                //Utiliser la constante que j'ai dit dans la ligne 74 ici
                if (this.playersCreatingAGame.get(gameName)?.length) this.sio.to(socket.id).emit(`${gameName} response on host presence`, true);
                else this.sio.to(socket.id).emit(`${gameName} response on host presence`, false);
            });

            socket.on('I am trying to join', (gameInfoAndUsername: string[]) => {
                this.addJoiningPlayer(socket.id, gameInfoAndUsername);
                const waitingSocketId = this.playersCreatingAGame.get(gameInfoAndUsername[0]) as string;
                this.sio
                    .to(waitingSocketId)
                    .emit(`${gameInfoAndUsername[0]} someone is trying to join`, this.getUsernameFirstPlayerWaiting(gameInfoAndUsername[0]));
            });

            socket.on('I dont want to join anymore', (gameName: string) => {
                this.deleteJoiningPlayer(socket.id, gameName);
                const waitingSocketId = this.playersCreatingAGame.get(gameName) as string;
                this.sio.to(waitingSocketId).emit(`${gameName} the player trying to join left`);
                // Les deux prochaines lignes sont réutilisées aux lignes  ==> pt les mettre dans un service
                if (this.playersJoiningAGame.get(gameName)?.length)
                    this.sio.to(waitingSocketId).emit(`${gameName} someone is trying to join`, this.getUsernameFirstPlayerWaiting(gameName));
            });

            socket.on('launch classic mode multiplayer match', async (gameName: string) => {
                const adversarySocketId = this.getIDFirstPlayerWaiting(gameName);
                this.deleteJoiningPlayer(adversarySocketId, gameName);
                this.deleteCreatorOfGame(gameName);
                //Mettre cette boucle for dans un service
                if (this.playersJoiningAGame.get(gameName)?.length) {
                    const playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
                    for (const player of playersWaiting) {
                        this.sio.to(player).emit(`${gameName} you have been declined`);
                    }
                }
                await this.startMultiplayerMatch(socket, adversarySocketId, gameName);
                this.sio.emit(`${gameName} nobody is waiting no more`);
            });

            socket.on('I refuse this adversary', (gameName: string) => {
                const waitingSocketId = this.getIDFirstPlayerWaiting(gameName);
                this.deleteJoiningPlayer(waitingSocketId, gameName);
                this.sio.to(waitingSocketId).emit(`${gameName} you have been declined`);
                if (this.playersJoiningAGame.get(gameName)?.length)
                    this.sio.to(socket.id).emit(`${gameName} someone is trying to join`, this.getUsernameFirstPlayerWaiting(gameName));
                else this.sio.to(socket.id).emit(`${gameName} the player trying to join left`);
            });

            socket.on('detect images difference', (imagesData: ImageDataToCompare) => {
                const differenceDetector = new DifferenceDetectorService(imagesData);
                const differencesInformations: DifferencesInformations = {
                    differencesList: differenceDetector.generateDifferencesList(),
                    nbOfDifferences: differenceDetector.getNbDifferences(),
                };
                socket.emit('game creation differences informations', differencesInformations);
            });

            socket.on('Verify position', (position: Position) => {
                this.clickResponse(socket, position);
            });

            socket.on('kill the game', () => {
                this.endGame(socket);
            });

            socket.on('Check if game is finished', () => {
                const mouseHandler: MouseHandlerService = this.getSocketMouseHandlerService(socket);
                if (mouseHandler.getNumberOfDifferencesFoundByPlayer(socket.id) === mouseHandler.nbDifferencesTotal) {
                    mouseHandler.resetData();
                    this.endGame(socket);
                    socket.emit('End game');
                }
            });
        });
    }

    private async beginGame(socket: io.Socket, gameName: string) {
        this.setupSocketGameRoom(socket, NO_OTHER_PLAYER_ROOM);
        this.setupNecessaryGameServices(socket);

        await this.getSocketMouseHandlerService(socket).generateDifferencesInformations(gameName);
        this.getSocketMouseHandlerService(socket).addPlayerToGame(socket.id);
        await this.sendImagesToClient(gameName, socket);
    }

    //To test
    private async startMultiplayerMatch(socket: io.Socket, adversarySocketId: string, gameName: string) {
        await this.beginGame(socket, gameName);

        const adversarySocket = this.getSocketByID(adversarySocketId);
        const gameRoomName = this.findSocketGameRoomName(socket);
        this.setupSocketGameRoom(adversarySocket, gameRoomName);
        this.getSocketMouseHandlerService(adversarySocket).addPlayerToGame(adversarySocketId);

        adversarySocket.emit(`${gameName} you have been accepted`);
        socket.emit('The adversary username is', adversarySocket.data.username);
        adversarySocket.emit('The adversary username is', socket.data.username);

        this.sio.to(gameRoomName).emit('classic mode');
        this.sio.to(gameRoomName).emit('The game is', gameName);
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

    private clickResponse(socket: io.Socket, mousePosition: Position) {
        const differencesInfo: GameplayDifferenceInformations = this.getSocketMouseHandlerService(socket).isValidClick(mousePosition, socket.id);
        differencesInfo.playerName = socket.data.username;
        this.sio.to(this.findSocketGameRoomName(socket)).emit('Valid click', differencesInfo);
    }

    private async sendImagesToClient(gameName: string, socket: io.Socket) {
        const gameImagesData: string[] = await this.gamesService.getGameImagesData(gameName);

        this.sio
            .to(this.findSocketGameRoomName(socket))
            .emit('classic solo images', [gameImagesData[ORIGINAL_IMAGE_POSITION], gameImagesData[MODIFIED_IMAGE_POSITION]]);
    }

    private endGame(socket: io.Socket) {
        const gameRoomName: string = this.findSocketGameRoomName(socket);
        this.endChrono(socket);
        this.chronometerServices.delete(gameRoomName);
        this.mouseHandlerServices.delete(gameRoomName);
        this.timeIntervals.delete(gameRoomName);
        socket.rooms.delete(gameRoomName);
    }

    private getSocketChronometerService(socket: io.Socket): ChronometerService {
        const gameRoomName = this.findSocketGameRoomName(socket);
        return this.chronometerServices.get(gameRoomName)!;
    }

    private getSocketMouseHandlerService(socket: io.Socket): MouseHandlerService {
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

    // Cette méthode devrait-elle être dans un service?
    private addJoiningPlayer(socketId: string, gameInfo: string[]) {
        this.addJoiningPlayerId(socketId, gameInfo[0]);
    }

    private addJoiningPlayerId(socketId: string, gameName: string) {
        let playersTryingToJoin: string[] = [];
        if (this.playersJoiningAGame.get(gameName)) {
            playersTryingToJoin = this.playersJoiningAGame.get(gameName) as string[];
            playersTryingToJoin.push(socketId);
            this.playersJoiningAGame.delete(gameName);
        } else {
            playersTryingToJoin.push(socketId);
        }
        this.playersJoiningAGame.set(gameName, playersTryingToJoin);
    }

    private deleteJoiningPlayer(socketId: string, gameName: string) {
        this.deleteJoiningPlayerId(socketId, gameName);
    }

    private deleteJoiningPlayerId(socketId: string, gameName: string) {
        let playersTryingToJoin = this.playersJoiningAGame.get(gameName) as string[];
        playersTryingToJoin = playersTryingToJoin?.filter((id) => id !== socketId);
        this.playersJoiningAGame.delete(gameName);
        this.playersJoiningAGame.set(gameName, playersTryingToJoin);
    }

    private getIDFirstPlayerWaiting(gameName: string) {
        let playersWaiting = this.playersJoiningAGame.get(gameName) as string[];
        let idWanted = playersWaiting.shift() as string;
        playersWaiting.unshift(idWanted);
        return idWanted;
    }

    private getUsernameFirstPlayerWaiting(gameName: string) {
        return this.getUsernamePlayer(this.getIDFirstPlayerWaiting(gameName));
    }

    private deleteCreatorOfGame(gameName: string) {
        this.playersCreatingAGame.delete(gameName);
    }

    private getUsernamePlayer(socketId: string) {
        return this.getSocketByID(socketId).data.username;
    }

    private setUsernamePlayer(socketId: string, username: string) {
        this.getSocketByID(socketId).data.username = username;
    }

    private getSocketByID(socketID: string): io.Socket {
        return this.sio.sockets.sockets.get(socketID)!;
    }
}
