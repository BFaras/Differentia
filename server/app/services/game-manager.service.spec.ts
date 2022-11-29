/* eslint-disable max-lines */
import { RecordTime } from '@app/classes/record-times';
import { ServerIOTestHelper } from '@app/classes/server-io-test-helper';
import { ServerSocketTestHelper } from '@app/classes/server-socket-test-helper';
import { NO_MORE_GAMES_AVAILABLE, TIMER_HIT_ZERO } from '@app/server-consts';
import { CLASSIC_MODE, GAME_ROOM_GENERAL_ID, LIMITED_TIME_MODE, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
import { GameInfo } from '@common/gameInfo';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { Container } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { GameManagerService } from './game-manager.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';

describe('GameManagerService tests', () => {
    const testGameName = 'test12345';
    const testUsername = 'myName15';
    const testSocketId1 = 'JKHSDA125';
    const testSocketId2 = 'IIUUYSD5896';
    const testGame: Game = {
        name: testGameName,
        numberOfDifferences: 2,
        times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
        images: ['image1', 'image2'],
        differencesList: [
            [599, 666],
            [899, 951],
        ],
    };

    let gameManagerService: GameManagerService;
    let serverSocket: io.Socket;
    let serverSocket2: io.Socket;
    let getRoomChronometerServiceStub: sinon.SinonStub;
    const chronometerService: ChronometerService = new ChronometerService();
    const gamesService: GamesService = Container.get(GamesService);
    const mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let mouseHandlerIsValidClickStub: sinon.SinonStub<[mousePosition: Position, plrSocketId: string], GameplayDifferenceInformations>;
    let testGameInfo: GameInfo;

    beforeEach(async () => {
        serverSocket = new ServerSocketTestHelper(testSocketId1) as unknown as io.Socket;
        serverSocket2 = new ServerSocketTestHelper(testSocketId2) as unknown as io.Socket;
        gameManagerService = new GameManagerService(new ServerIOTestHelper() as unknown as io.Server);
        testGameInfo = {
            socket: serverSocket,
            adversarySocket: undefined,
            gameName: testGameName,
            gameMode: '',
        };
        sinon.stub(GameManagerService.prototype, <any>'getSocketChronometerService').callsFake((socket) => {
            return chronometerService;
        });

        sinon.stub(GameManagerService.prototype, <any>'getSocketMouseHandlerService').callsFake((socket) => {
            return mouseHandlerService;
        });

        getRoomChronometerServiceStub = sinon.stub(GameManagerService.prototype, <any>'getRoomChronometerService').callsFake((socket) => {
            return chronometerService;
        });

        sinon.stub(gamesService, 'getGame').callsFake(async (gameName: string) => {
            return Promise.resolve(testGame);
        });

        sinon.stub(gamesService, 'getGameImagesData').callsFake(async (gameName: string) => {
            return Promise.resolve(['', '']);
        });

        gameManagerService.gamesRooms.set(testGameName, [testSocketId1 + GAME_ROOM_GENERAL_ID, testSocketId2 + GAME_ROOM_GENERAL_ID]);

        mouseHandlerIsValidClickStub = sinon.stub(MouseHandlerService.prototype, 'isValidClick').callsFake((): GameplayDifferenceInformations => {
            return {
                differencePixelsNumbers: NO_DIFFERENCE_FOUND_ARRAY,
                isValidDifference: true,
                socketId: testUsername,
                playerUsername: testUsername,
            };
        });

        serverSocket.data.username = testUsername;
    });

    afterEach(async () => {
        mouseHandlerService.resetDifferencesData();
        sinon.restore();
    });

    it('should call setupSocketGameRoom() on beginGame()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'setupSocketGameRoom');
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.beginGame(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should call setupNecessaryGameServices() on begin game', async () => {
        const spy = sinon.spy(gameManagerService, <any>'setupNecessaryGameServices');
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.beginGame(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should beginGame() should call generateDifferencesInformations() from MouseHandlerService on beginGame()', async () => {
        const spy = sinon.spy(mouseHandlerService, 'generateDifferencesInformations');
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.beginGame(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should beginGame() should call addPlayerToGame() from MouseHandlerService on beginGame()', async () => {
        const spy = sinon.spy(mouseHandlerService, 'addPlayerToGame');
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.beginGame(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should call sendImagesToClient() on beginGame()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'sendImagesToClient');
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.beginGame(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should call beginGame() on startMultiplayerMatch()', async () => {
        const spy = sinon.spy(gameManagerService, 'beginGame');
        testGameInfo.adversarySocket = serverSocket2;
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.startMultiplayerMatch(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should call findSocketGameRoomName() on startMultiplayerMatch()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'findSocketGameRoomName');
        testGameInfo.adversarySocket = serverSocket2;
        testGameInfo.gameMode = CLASSIC_MODE;
        await gameManagerService.startMultiplayerMatch(testGameInfo);
        expect(spy.calledOnce);
    });

    it('should call isValidClick() from MouseHandlerService on clickResponse()', () => {
        const positionTest = { x: 0, y: 0 };
        gameManagerService.clickResponse(serverSocket, positionTest);
        expect(mouseHandlerIsValidClickStub.calledOnce);
    });

    it('should call isGameFinishedSolo() to verify if the game is finished', () => {
        const spy = sinon.spy(gameManagerService, <any>'isGameFinishedSolo');
        gameManagerService.isGameFinishedSolo(serverSocket);
        expect(spy.calledOnce);
    });

    it('should call isGameFinishedMulti() to verify if the game is finished', () => {
        const spy = sinon.spy(gameManagerService, <any>'isGameFinishedMulti');
        gameManagerService.isGameFinishedMulti(serverSocket);
        expect(spy.calledOnce);
    });

    it('should call deleteRoom() on handleEndGameEmit()', () => {
        const stub = sinon.stub(gameManagerService, <any>'deleteRoom').callsFake(() => {});
        gameManagerService.handleEndGameEmits(serverSocket, true);
        expect(stub.calledOnce);
    });

    it('should call deleteRoom() on handleAbandonEmit()', () => {
        const spy = sinon.spy(gameManagerService, <any>'deleteRoom');
        serverSocket.join(testSocketId1 + GAME_ROOM_GENERAL_ID);
        gameManagerService.handleAbandonEmit(serverSocket, CLASSIC_MODE);
        expect(spy);
    });

    it('should call findSocketGameRoomName() on getSocketMouseHandlerService()', () => {
        const spy = sinon.stub(gameManagerService, <any>'findSocketGameRoomName').callsFake(() => {});
        gameManagerService.getSocketMouseHandlerService(serverSocket);
        expect(spy.calledOnce);
    });

    it('should call endChrono() on endGame()', () => {
        const spy = sinon.spy(gameManagerService, <any>'endChrono');
        gameManagerService.endGame(serverSocket, CLASSIC_MODE);
        expect(spy.calledOnce);
    });

    it('should send the different pixels not found', () => {
        const stub = sinon.stub(mouseHandlerService, 'getDifferentPixelListNotFound').callsFake(() => {
            return [];
        });
        gameManagerService.sendDifferentPixelsNotFound(serverSocket);
        expect(stub.calledOnce);
    });

    it('should tell if the game in solo is done or not', () => {
        mouseHandlerService.nbDifferencesTotal = 7;
        const stub = sinon.stub(mouseHandlerService, 'getNumberOfDifferencesFoundByPlayer').callsFake(() => {
            return 4;
        });
        expect(gameManagerService.isGameFinishedSolo(serverSocket)).to.equal(false);
        expect(stub.calledOnce);
    });

    it('should tell if that the multiplayer game is done with 4 differences found on 7', () => {
        mouseHandlerService.nbDifferencesTotal = 7;
        const stub = sinon.stub(mouseHandlerService, 'getNumberOfDifferencesFoundByPlayer').callsFake(() => {
            return 4;
        });
        expect(gameManagerService.isGameFinishedMulti(serverSocket)).to.equal(true);
        expect(stub.calledOnce);
    });

    it('should tell if that the multiplayer game is done with 2 differences found on 6', () => {
        mouseHandlerService.nbDifferencesTotal = 6;
        const stub = sinon.stub(mouseHandlerService, 'getNumberOfDifferencesFoundByPlayer').callsFake(() => {
            return 2;
        });
        expect(gameManagerService.isGameFinishedMulti(serverSocket)).to.equal(true);
        expect(stub.calledOnce);
    });

    it('should logRoomsWithGames()', () => {
        const gameName = 'car';
        const roomName = 'room1';
        gameManagerService['logRoomsWithGames'](gameName, roomName);
        expect(gameManagerService.gamesRooms.has(gameName)).to.equal(true);
    });

    it('should getGameRooms()', () => {
        gameManagerService.getGameRooms();
        expect(gameManagerService.gamesRooms.has(testGameName)).to.equal(true);
    });

    it('should deleteRoom()', () => {
        gameManagerService.gamesRooms.get(testGameName)?.pop();
        gameManagerService.gamesRooms.get(testGameName)?.pop();

        const spy = sinon.spy(gameManagerService.gamesRooms, 'delete');
        const stub = sinon.stub(gameManagerService, 'findSocketGameRoomName');
        gameManagerService['deleteRoom'](serverSocket);
        expect(stub.calledOnce);
        expect(spy.calledOnceWith(testGameName));
    });

    it('should call endGameWithDependecies with !TIMER_HIT_ZERO and NO_MORE_GAMES_AVAILABLE as the parameters when the mode is Limited Time', () => {
        const spy = sinon.spy(GameManagerService.prototype, <any>'endGameWithDependencies')
        gameManagerService.endGame(serverSocket, LIMITED_TIME_MODE);
        expect(spy.calledOnceWith(serverSocket, !TIMER_HIT_ZERO, NO_MORE_GAMES_AVAILABLE));
    });

    it("clickResponse should call increaseTimeByBonusTime of the room's chronometer service if the game mode is Limited Time", () => {
        serverSocket.data.gameMode = LIMITED_TIME_MODE;
        const positionTest = { x: 0, y: 0 };
        const stub = sinon.stub(chronometerService, 'increaseTimeByBonusTime').callsFake(() => {});
        gameManagerService['setupNecessaryGameServices'](serverSocket, LIMITED_TIME_MODE);
        const spyOne = sinon.spy(GameManagerService.prototype, <any>'findSocketGameRoomName');
        gameManagerService.clickResponse(serverSocket, positionTest);
        expect(spyOne.calledOnce);
        expect(getRoomChronometerServiceStub.calledOnce);
        expect(stub.calledOnce);
    });

    it('isGameFinished should call limitedTimeIsGameFinished when the mode is Limited Time', () => {
        const spy = sinon.spy(GameManagerService.prototype, <any>'limitedTimeIsGameFinished')
        gameManagerService.isGameFinished(serverSocket, true, LIMITED_TIME_MODE);
        expect(spy.calledOnce);
    });

    it('isGameFinished should call classicIsGameFinished when the mode is Classic', () => {
        const spy = sinon.spy(GameManagerService.prototype, <any>'classicIsGameFinished')
        gameManagerService.isGameFinished(serverSocket, true, CLASSIC_MODE);
        expect(spy.calledOnce);
    });

    it('initializeSocketGameHistoryLimitedTimeMode should set the attribute gamesPlayed from the socket data to a empty array', () => {
        gameManagerService.initializeSocketGameHistoryLimitedTimeMode(serverSocket);
        expect(serverSocket.data.gamesPlayed).to.deep.equal([]);
    });

    it('addGameToHistoryLimitedTimeMode should add a gameName to the attribute gamesPlayed from the socket data', () => {
        gameManagerService.initializeSocketGameHistoryLimitedTimeMode(serverSocket);
        gameManagerService.addGameToHistoryLimitedTimeMode(serverSocket, testGameName);
        expect(serverSocket.data.gamesPlayed[0]).to.equal(testGameName);
    });

    it('startLimitedTimeSocketGameHistory should call the methods initialize and addGameToHistoryLimitedTimeMode', () => {
        const initializeSocketGameHistoryLimitedTimeModeStub = sinon
            .stub(GameManagerService.prototype, <any>'initializeSocketGameHistoryLimitedTimeMode')
            .callsFake(() => {});
        const addGameToHistoryLimitedTimeModeStub = sinon.stub(GameManagerService.prototype, 'addGameToHistoryLimitedTimeMode').callsFake(() => {});
        gameManagerService.startLimitedTimeSocketGameHistory(serverSocket, testGameName);
        expect(initializeSocketGameHistoryLimitedTimeModeStub.calledOnce);
        expect(addGameToHistoryLimitedTimeModeStub.calledOnce);
    });

    it('initializeSocketGameHistoryLimitedTimeMode should set the attribute gamesPlayed from the socket data to a empty array', () => {
        const stub = sinon.stub(GameManagerService.prototype, <any>'switchGame').callsFake(() => {});
        gameManagerService.doWeHaveToSwitchGame(serverSocket, LIMITED_TIME_MODE);
        expect(stub.calledOnce);
    });

    it('switchGame should call 4 methods if it is called with 2 sockets', async () => {
        const generateRandomGameStub = sinon
            .stub(gameManagerService['gamesService'], 'generateRandomGame')
            .callsFake(async (gamesAlreadyPlayed: string[]) => {
                return Promise.resolve(testGame);
            });
        const resetMouseHandlerServiceStub = sinon.stub(GameManagerService.prototype, <any>'resetMouseHandlerService').callsFake(() => {});
        const addGameToHistoryLimitedTimeModeStub = sinon.stub(GameManagerService.prototype, 'addGameToHistoryLimitedTimeMode').callsFake(() => {});
        const sendImagesToClientStub = sinon.stub(GameManagerService.prototype, <any>'sendImagesToClient').callsFake(async () => {});
        const serverEmitStub = sinon.stub(gameManagerService['sio'], 'emit');
        await gameManagerService['switchGame'](serverSocket, serverSocket2);
        expect(generateRandomGameStub.calledOnce);
        expect(resetMouseHandlerServiceStub.calledOnce);
        expect(sendImagesToClientStub.calledOnce);
        expect(serverEmitStub.calledOnce);
        expect(addGameToHistoryLimitedTimeModeStub.called);
    });

    it('switchGame should call 3 methods if it is called with 1 socket', async () => {
        const generateRandomGameStub = sinon
            .stub(gameManagerService['gamesService'], 'generateRandomGame')
            .callsFake(async (gamesAlreadyPlayed: string[]) => {
                return Promise.resolve(testGame);
            });
        const resetMouseHandlerServiceStub = sinon.stub(GameManagerService.prototype, <any>'resetMouseHandlerService').callsFake(() => {});
        const addGameToHistoryLimitedTimeModeStub = sinon.stub(GameManagerService.prototype, 'addGameToHistoryLimitedTimeMode').callsFake(() => {});
        const sendImagesToClientStub = sinon.stub(GameManagerService.prototype, <any>'sendImagesToClient').callsFake(async () => {});
        const serverEmitStub = sinon.stub(gameManagerService['sio'], 'emit');
        await gameManagerService['switchGame'](serverSocket, serverSocket2);
        expect(generateRandomGameStub.calledOnce);
        expect(resetMouseHandlerServiceStub.notCalled);
        expect(sendImagesToClientStub.calledOnce);
        expect(serverEmitStub.calledOnce);
        expect(addGameToHistoryLimitedTimeModeStub.called);
    });

    it('classicIsGameFinished should call classicIsGameFinishedSolo when it is called with isItMultiplayer = false', () => {
        const classicIsGameFinishedSoloStub = sinon.spy(gameManagerService, <any>'classicIsGameFinishedSolo');
        mouseHandlerService.addPlayerToGame(serverSocket.id);
        expect(gameManagerService['classicIsGameFinished'](serverSocket, false)).to.equal(true);
        expect(classicIsGameFinishedSoloStub.calledOnce);
    });

    it('classicIsGameFinished should call classicIsGameFinishedMultiplayer when it is called with isItMultiplayer = true', () => {
        const classicIsGameFinishedMultiplayerStub = sinon.spy(gameManagerService, <any>'classicIsGameFinishedMultiplayer');
        mouseHandlerService.addPlayerToGame(serverSocket.id);
        mouseHandlerService.nbDifferencesTotal = 3;
        expect(gameManagerService['classicIsGameFinished'](serverSocket, true)).to.equal(false);
        expect(classicIsGameFinishedMultiplayerStub.calledOnce);
    });

    it('handleAbandonEmit should emit the Other player abandonned LM event when it is called with gameMode = Limited time', () => {
        const emitStub = sinon.spy(gameManagerService['sio'], 'emit');
        gameManagerService.handleAbandonEmit(serverSocket, LIMITED_TIME_MODE);
        expect(emitStub.calledOnceWith('Other player abandonned LM', serverSocket.data.username));
    });
});
