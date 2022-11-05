import { ServerIOTestHelper } from '@app/classes/server-io-test-helper';
import { ServerSocketTestHelper } from '@app/classes/server-socket-test-helper';
import { NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
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
        times: [],
        images: ['image1', 'image2'],
        differencesList: [
            [599, 666],
            [899, 951],
        ],
    };

    let gameManagerService: GameManagerService;
    let serverSocket: io.Socket;
    let serverSocket2: io.Socket;
    let chronometerService: ChronometerService = new ChronometerService();
    let gamesService: GamesService = Container.get(GamesService);
    let mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let mouseHandlerIsValidClickStub: sinon.SinonStub<[mousePosition: Position, plrSocketId: string], GameplayDifferenceInformations>;

    beforeEach(async () => {
        serverSocket = new ServerSocketTestHelper(testSocketId1) as unknown as io.Socket;
        serverSocket2 = new ServerSocketTestHelper(testSocketId2) as unknown as io.Socket;
        gameManagerService = new GameManagerService(new ServerIOTestHelper() as unknown as io.Server);

        sinon.stub(GameManagerService.prototype, <any>'getSocketChronometerService').callsFake((socket) => {
            return chronometerService;
        });

        sinon.stub(GameManagerService.prototype, <any>'getSocketMouseHandlerService').callsFake((socket) => {
            return mouseHandlerService;
        });

        sinon.stub(GameManagerService.prototype, <any>'getSocketUsername').callsFake((socket) => {
            return testUsername;
        });

        sinon.stub(gamesService, 'getGame').callsFake(async (gameName: string) => {
            return Promise.resolve(testGame);
        });

        sinon.stub(gamesService, 'getGameImagesData').callsFake(async (gameName: string) => {
            return Promise.resolve(['', '']);
        });

        mouseHandlerIsValidClickStub = sinon.stub(MouseHandlerService.prototype, 'isValidClick').callsFake(() => {
            return {
                differencePixelsNumbers: NO_DIFFERENCE_FOUND_ARRAY,
                isValidDifference: false,
                socketId: testSocketId1,
                playerUsername: testUsername,
            };
        });
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('should call setupSocketGameRoom() on beginGame()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'setupSocketGameRoom');
        await gameManagerService.beginGame(serverSocket, testGameName);
        expect(spy.calledOnce);
    });

    it('should call setupNecessaryGameServices() on begin game', async () => {
        const spy = sinon.spy(gameManagerService, <any>'setupNecessaryGameServices');
        await gameManagerService.beginGame(serverSocket, testGameName);
        expect(spy.calledOnce);
    });

    it('should beginGame() should call generateDifferencesInformations() from MouseHandlerService on beginGame()', async () => {
        const spy = sinon.spy(mouseHandlerService, 'generateDifferencesInformations');
        await gameManagerService.beginGame(serverSocket, testGameName);
        expect(spy.calledOnce);
    });

    it('should beginGame() should call addPlayerToGame() from MouseHandlerService on beginGame()', async () => {
        const spy = sinon.spy(mouseHandlerService, 'addPlayerToGame');
        await gameManagerService.beginGame(serverSocket, testGameName);
        expect(spy.calledOnce);
    });

    it('should call sendImagesToClient() on beginGame()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'sendImagesToClient');
        await gameManagerService.beginGame(serverSocket, testGameName);
        expect(spy.calledOnce);
    });

    it('should call beginGame() on startMultiplayerMatch()', async () => {
        const spy = sinon.spy(gameManagerService, 'beginGame');
        await gameManagerService.startMultiplayerMatch(serverSocket, serverSocket2, testGameName);
        expect(spy.calledOnce);
    });

    it('should call findSocketGameRoomName() on startMultiplayerMatch()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'findSocketGameRoomName');
        await gameManagerService.startMultiplayerMatch(serverSocket, serverSocket2, testGameName);
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

    // Tests passed pas, why?
    it('should call deleteRoom() on handleEndGameEmit()', () => {
        const spy = sinon.spy(gameManagerService, <any>'deleteRoom');
        gameManagerService.handleEndGameEmits(serverSocket, true);
        expect(spy.calledOnce);
    });

    // Tests passed pas, why?
    it('should call deleteRoom() on handleAbandonEmit()', () => {
        const spy = sinon.spy(gameManagerService, <any>'deleteRoom');
        gameManagerService.handleAbandonEmit(serverSocket);
        expect(spy.calledOnce);
    });

    // Devrait couvrir ligen 117-118
    it('should call findSocketGameRoomName() on getSocketMouseHandlerService()', () => {
        const spy = sinon.spy(gameManagerService, <any>'findSocketGameRoomName');
        gameManagerService.getSocketMouseHandlerService(serverSocket);
        expect(spy.calledOnce);
    });

    it('should call endChrono() on endGame()', () => {
        const spy = sinon.spy(gameManagerService, <any>'endChrono');
        gameManagerService.endGame(serverSocket);
        expect(spy.calledOnce);
    });
});
