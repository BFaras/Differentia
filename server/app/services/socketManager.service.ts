/* eslint-disable no-console */
import { HOST_CHOSE_ANOTHER, NO_AVAILABLE, SOMEBODY_IS_WAITING, ZERO_GAMES_PLAYED } from '@app/server-consts';
import { ChatMessage } from '@common/chat-message';
import { CLASSIC_MODE, HOST_PRESENT, LIMITED_TIME_MODE, MSG_RESET_ALL_TIME, MSG_RESET_TIME } from '@common/const';
import { DifferencesInformations } from '@common/differences-informations';
import { GameInfo } from '@common/gameInfo';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { RecordTimeInformations } from '@common/record-time-infos';
import * as http from 'http';
import * as io from 'socket.io';
import Container from 'typedi';
import { BestTimesService } from './best-times.service';
import { ClueManagerService } from './clue-manager.service';
import { RecordTimesService } from './database.games.service';
import { DatabaseService } from './database.service';
import { DifferenceDetectorService } from './difference-detector.service';
import { GameManagerService } from './game-manager.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';
import { TimeConstantsService } from './time-constants.service';
import { WaitingLineHandlerService } from './waiting-line-handler.service';

export class SocketManager {
    socket: io.Socket;
    private sio: io.Server;
    private databaseService: DatabaseService = Container.get(DatabaseService);
    private recordTimesService: RecordTimesService = new RecordTimesService(this.databaseService);
    private waitingLineHandlerService: WaitingLineHandlerService = new WaitingLineHandlerService();
    private gameManagerService: GameManagerService;
    private gamesService: GamesService = new GamesService();
    private timeConstantsService: TimeConstantsService = new TimeConstantsService();
    private bestTimesService: BestTimesService;
    private currentGameName: string;

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] }, maxHttpBufferSize: 1e7 });
        this.gameManagerService = new GameManagerService(this.sio);
        this.bestTimesService = new BestTimesService(this.sio);
    }

    handleSockets(): void {
        this.sio.on('connection', (socket: io.Socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            this.socket = socket;

            socket.on('message', (message: string) => {
                console.log(message);
            });

            socket.on('disconnect', (reason: string) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('solo classic mode', async (gameName: string) => {
                this.sio.to(socket.id).emit(CLASSIC_MODE);
                this.sio.to(socket.id).emit('The game is', gameName);
                this.currentGameName = gameName;
                const username = this.waitingLineHandlerService.getUsernamePlayer(socket.id, this.sio);
                const gameInfo: GameInfo = {
                    socket,
                    adversarySocket: undefined,
                    gameName,
                    gameMode: CLASSIC_MODE,
                };
                this.sio.to(socket.id).emit('show the username', username);
                await this.gameManagerService.beginGame(gameInfo);
            });

            socket.on('solo limited time mode', async () => {
                this.sio.to(socket.id).emit(LIMITED_TIME_MODE);
                const username = this.waitingLineHandlerService.getUsernamePlayer(socket.id, this.sio);
                const gameName = (await this.gamesService.generateRandomGame(ZERO_GAMES_PLAYED)).name;
                const gameInfo: GameInfo = {
                    socket,
                    adversarySocket: undefined,
                    gameName,
                    gameMode: LIMITED_TIME_MODE,
                };
                this.sio.to(socket.id).emit('The game is', gameName);
                this.sio.to(socket.id).emit('show the username', username);
                await this.gameManagerService.beginGame(gameInfo);
                this.gameManagerService.startLimitedTimeSocketGameHistory(socket, gameName);
            });

            socket.on('is there someone waiting', (gameName: string) => {
                socket.emit(
                    `${gameName} let me tell you if someone is waiting`,
                    this.waitingLineHandlerService.getCreatorPlayer(gameName) !== undefined,
                );
            });

            socket.on('Apply delete or reset on gameForm', () => {
                socket.emit('Delete or reset applied on gameForm');
            });

            socket.on('my username is', (username: string) => {
                if (username.charAt(0) !== ' ') {
                    console.log('jtenvoie valid username' + username);
                    this.waitingLineHandlerService.setUsernamePlayer(socket.id, username, this.sio);
                    this.sio.to(socket.id).emit('username valid');
                } else this.sio.to(socket.id).emit('username not valid');
            });

            socket.on('gameMode is', (classicFlag: boolean) => {
                if (classicFlag) this.sio.to(socket.id).emit(CLASSIC_MODE);
                else this.sio.to(socket.id).emit(`open the ${LIMITED_TIME_MODE} pop-dialog`);
            });

            socket.on('I am waiting', (gameName: string) => {
                this.waitingLineHandlerService.addCreatingPlayer(gameName, socket.id);
                this.sio.emit(`${gameName} let me tell you if someone is waiting`, SOMEBODY_IS_WAITING);
            });

            socket.on('I am trying to play a limited time game', () => {
                if (this.waitingLineHandlerService.isSomebodyWaitingForALimitedTimeGame()) {
                    const adversarySocketId = this.waitingLineHandlerService.getLimitedTimeWaitingPlayerId();
                    this.sio.to(adversarySocketId).emit('response on limited time waiting line', SOMEBODY_IS_WAITING);
                    this.sio.to(socket.id).emit('response on limited time waiting line', SOMEBODY_IS_WAITING);
                } else {
                    console.log('attend bitch');
                    this.waitingLineHandlerService.addLimitedTimeWaitingPlayer(socket.id);
                    this.sio.to(socket.id).emit('response on limited time waiting line', !SOMEBODY_IS_WAITING);
                }
            });

            socket.on('Reset game list', async () => {
                this.sio.emit('Ready to reset game list', await this.gameManagerService.resetGameList());
            });

            socket.on('Reset records time board', async (value?: string) => {
                if (value) await this.recordTimesService.resetGameRecordTimes(value).then((res) => {});
                else await this.recordTimesService.resetAllGamesRecordTimes().then((res) => {});
                value = value ? MSG_RESET_TIME + value : MSG_RESET_ALL_TIME;
                this.sio.except(this.gameManagerService.collectAllSocketsRooms()).emit('Page reloaded', value);
                this.gameManagerService.allSocketsRooms = [];
            });

            socket.on('Reload game selection page', (gameName: string | string[]) => {
                if (gameName) {
                    this.sio.emit('close popDialogUsername', gameName);
                    this.sio.except(this.gameManagerService.collectAllSocketsRooms()).emit('Page reloaded', gameName);
                    this.gameManagerService.allSocketsRooms = [];
                }
            });

            socket.on('refresh games after closing popDialog', (value) => {
                this.sio.to(value).emit('game list updated', value);
            });

            socket.on('Set time constants', (timeConstants) => {
                this.timeConstantsService.setTimes(timeConstants).then((value) => {});
            });

            socket.on('I left', (gameName: string) => {
                this.waitingLineHandlerService.deleteCreatorOfGame(gameName);
                this.waitingLineHandlerService.sendEventToAllJoiningPlayers(this.sio, gameName, 'response on host presence');
                this.sio.emit(`${gameName} nobody is waiting no more`);
            });

            socket.on('I left from LM', () => {
                this.waitingLineHandlerService.resetLimitedTimeWaitingLine();
            });

            socket.on('need reconnection', () => {
                this.sio.to(socket.id).emit('reconnect');
            });

            socket.on('Is the host still there', (gameName: string) => {
                if (this.waitingLineHandlerService.getCreatorPlayer(gameName))
                    this.sio.to(socket.id).emit(`${gameName} response on host presence`, HOST_PRESENT);
                else this.sio.to(socket.id).emit(`${gameName} response on host presence`, !HOST_PRESENT);
            });

            socket.on('I am trying to join', (gameName: string) => {
                this.waitingLineHandlerService.addJoiningPlayer(socket.id, gameName);
                const waitingSocketId = this.waitingLineHandlerService.getCreatorPlayer(gameName) as string;
                this.sio
                    .to(waitingSocketId)
                    .emit(`${gameName} someone is trying to join`, this.waitingLineHandlerService.getUsernameFirstPlayerWaiting(gameName, this.sio));
            });

            socket.on('I dont want to join anymore', (gameName: string) => {
                this.waitingLineHandlerService.deleteJoiningPlayer(socket.id, gameName);
                const waitingSocketId = this.waitingLineHandlerService.getCreatorPlayer(gameName) as string;
                this.sio.to(waitingSocketId).emit(`${gameName} the player trying to join left`);
                if (this.waitingLineHandlerService.getPresenceOfJoiningPlayers(gameName))
                    this.waitingLineHandlerService.updateJoiningPlayer(this.sio, gameName, 'someone is trying to join');
            });

            socket.on('launch classic mode multiplayer match', async (gameName: string) => {
                const adversarySocketId = this.waitingLineHandlerService.getIDFirstPlayerWaiting(gameName);
                this.waitingLineHandlerService.deleteJoiningPlayer(adversarySocketId, gameName);
                this.waitingLineHandlerService.deleteCreatorOfGame(gameName);
                this.waitingLineHandlerService.sendEventToAllJoiningPlayers(this.sio, gameName, 'you have been declined');
                const gameInfo: GameInfo = {
                    socket,
                    adversarySocket: this.waitingLineHandlerService.getSocketByID(adversarySocketId, this.sio),
                    gameName,
                    gameMode: CLASSIC_MODE,
                };
                await this.gameManagerService.startMultiplayerMatch(gameInfo);
                this.sio.emit(`${gameName} nobody is waiting no more`);
            });

            socket.on('launch limited time mode multiplayer match', async () => {
                const adversarySocket = this.waitingLineHandlerService.getSocketByID(
                    this.waitingLineHandlerService.getLimitedTimeWaitingPlayerId(),
                    this.sio,
                );
                this.waitingLineHandlerService.resetLimitedTimeWaitingLine();
                const gameName = (await this.gamesService.generateRandomGame(ZERO_GAMES_PLAYED)).name;
                const gameInfo: GameInfo = {
                    socket,
                    adversarySocket,
                    gameName,
                    gameMode: LIMITED_TIME_MODE,
                };
                await this.gameManagerService.startMultiplayerMatch(gameInfo);
                this.gameManagerService.startLimitedTimeSocketGameHistory(socket, gameName);
            });

            socket.on('I refuse this adversary', (gameName: string) => {
                const waitingSocketId = this.waitingLineHandlerService.getIDFirstPlayerWaiting(gameName);
                this.waitingLineHandlerService.deleteJoiningPlayer(waitingSocketId, gameName);
                this.sio.to(waitingSocketId).emit(`${gameName} you have been declined`, !HOST_CHOSE_ANOTHER);
                if (this.waitingLineHandlerService.getPresenceOfJoiningPlayers(gameName))
                    this.waitingLineHandlerService.updateJoiningPlayer(this.sio, gameName, 'someone is trying to join');
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
                this.gameManagerService.clickResponse(socket, position);
            });

            socket.on('Cheat key pressed', () => {
                this.gameManagerService.sendDifferentPixelsNotFound(socket);
            });

            socket.on('kill the game', (gameMode: string) => {
                this.gameManagerService.handleAbandonEmit(socket, gameMode);
            });

            //To test
            socket.on('Check if game is finished', async (isMultiplayer: boolean) => {
                const mouseHandler: MouseHandlerService = this.gameManagerService.getSocketMouseHandlerService(socket);
                const mode = this.gameManagerService.getSocketChronometerService(socket).mode;
                const isGameFinished = await this.gameManagerService.isGameFinished(socket, isMultiplayer, mode);
                const playerUsername = this.gameManagerService.getSocketUsername(socket);
                if (isGameFinished) {
                    mouseHandler.resetDifferencesData();
                    if (mode === CLASSIC_MODE && (await this.gamesService.getGame(this.currentGameName)) !== undefined) {
                        const playerGameTime = this.gameManagerService.getSocketChronometerService(socket).time;
                        const recordTimeInfos: RecordTimeInformations = {
                            playerName: playerUsername,
                            playerRanking: NO_AVAILABLE,
                            gameName: this.currentGameName,
                            isMultiplayer: isMultiplayer,
                        };
                        await this.bestTimesService.compareGameTimeWithDbTimes(playerGameTime, recordTimeInfos);
                        this.gameManagerService.handleEndGameEmits(
                            socket,
                            isMultiplayer,
                            this.bestTimesService.hasNewRecord,
                            this.bestTimesService.playerRanking,
                        );
                        this.bestTimesService.notifyAllActivePlayers(playerUsername, this.currentGameName, isMultiplayer);
                    }
                    if (mode === CLASSIC_MODE && (await this.gamesService.getGame(this.currentGameName)) === undefined) {
                        this.gameManagerService.handleEndGameEmits(
                            socket,
                            isMultiplayer,
                            this.bestTimesService.hasNewRecord,
                            this.bestTimesService.playerRanking,
                        );
                    }
                    this.gameManagerService.endGame(socket, mode);
                } else {
                    this.gameManagerService.doWeHaveToSwitchGame(socket, mode);
                }
            });

            socket.on('playerMessage', (msg: ChatMessage) => {
                this.sio.to(this.gameManagerService.findSocketGameRoomName(socket)).emit('Send message to opponent', msg);
            });

            socket.on('get clue for player', () => {
                const clueManagerService = Container.get(ClueManagerService);
                const playerMouseHandlerService = this.gameManagerService.getSocketMouseHandlerService(socket);
                const playerChronometerService = this.gameManagerService.getSocketChronometerService(socket);
                clueManagerService.sendClueToPlayer(socket, playerMouseHandlerService, playerChronometerService);
                this.sio.to(this.gameManagerService.findSocketGameRoomName(socket)).emit('time', playerChronometerService.time);
            });
        });
    }
}
