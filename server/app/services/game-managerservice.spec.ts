import { FIRST_ARRAY_POSITION, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { Server } from 'app/server';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { GameManagerService } from './game-manager.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';
import { SocketManager } from './socketManager.service';

describe('GameManagerService tests', () => {
    const testGameName = 'test12345';
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

    let socketManager: SocketManager;
    let gameManagerService: GameManagerService;
    let server: Server;
    let serverSockets: io.Socket[];
    let clientSocket1: Socket;
    let clientSocket2: Socket;
    let chronometerService: ChronometerService = new ChronometerService();
    let gamesService: GamesService = Container.get(GamesService);
    let mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let mouseHandlerIsValidClickStub: sinon.SinonStub<[mousePosition: Position, plrSocketId: string], GameplayDifferenceInformations>;

    const urlString = 'http://localhost:3000';

    before(async () => {
        server = Container.get(Server);
        server.init();
        socketManager = server['socketManager'];
        clientSocket1 = ioClient(urlString, { transports: ['websocket'], upgrade: false });
        clientSocket2 = ioClient(urlString, { transports: ['websocket'], upgrade: false });
        serverSockets = [];
        gameManagerService = new GameManagerService(socketManager['sio']);

        sinon.stub(GameManagerService.prototype, <any>'getSocketChronometerService').callsFake((socket) => {
            return chronometerService;
        });

        sinon.stub(GameManagerService.prototype, <any>'getSocketMouseHandlerService').callsFake((socket) => {
            return mouseHandlerService;
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
                //To modify with a constant (constant is in feature/ChatGameView)
                playerName: '',
            };
        });

        socketManager['sio'].on('connection', (socket: io.Socket) => {
            serverSockets.push(socket);
        });
    });

    after(async () => {
        await clientSocket1.disconnect();
        clientSocket1.close();
        await clientSocket2.disconnect();
        clientSocket2.close();
        socketManager['sio'].close();
        sinon.restore();
    });

    it('should call setupSocketGameRoom() on beginGame()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'setupSocketGameRoom');
        await gameManagerService.beginGame(serverSockets[FIRST_ARRAY_POSITION], testGameName);
        expect(spy.calledOnce);
    });

    it('should call setupNecessaryGameServices() on begin game', async () => {
        const spy = sinon.spy(gameManagerService, <any>'setupNecessaryGameServices');
        await gameManagerService.beginGame(serverSockets[FIRST_ARRAY_POSITION], testGameName);
        expect(spy.calledOnce);
    });

    it('should beginGame() should call generateDifferencesInformations() from MouseHandlerService on beginGame()', async () => {
        const spy = sinon.spy(mouseHandlerService, 'generateDifferencesInformations');
        await gameManagerService.beginGame(serverSockets[FIRST_ARRAY_POSITION], testGameName);
        expect(spy.calledOnce);
    });

    it('should beginGame() should call addPlayerToGame() from MouseHandlerService on beginGame()', async () => {
        const spy = sinon.spy(mouseHandlerService, 'addPlayerToGame');
        await gameManagerService.beginGame(serverSockets[FIRST_ARRAY_POSITION], testGameName);
        expect(spy.calledOnce);
    });

    it('should call sendImagesToClient() on beginGame()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'sendImagesToClient');
        await gameManagerService.beginGame(serverSockets[FIRST_ARRAY_POSITION], testGameName);
        expect(spy.calledOnce);
    });

    it('should call beginGame() on startMultiplayerMatch()', async () => {
        const spy = sinon.spy(gameManagerService, 'beginGame');
        await gameManagerService.startMultiplayerMatch(serverSockets[FIRST_ARRAY_POSITION], serverSockets[FIRST_ARRAY_POSITION + 1], testGameName);
        expect(spy.calledOnce);
    });

    it('should call findSocketGameRoomName() on startMultiplayerMatch()', async () => {
        const spy = sinon.spy(gameManagerService, <any>'findSocketGameRoomName');
        await gameManagerService.startMultiplayerMatch(serverSockets[FIRST_ARRAY_POSITION], serverSockets[FIRST_ARRAY_POSITION + 1], testGameName);
        expect(spy.calledOnce);
    });

    it('should call isValidClick() from MouseHandlerService on clickResponse()', () => {
        const positionTest = { x: 0, y: 0 };
        gameManagerService.clickResponse(serverSockets[FIRST_ARRAY_POSITION], positionTest);
        expect(mouseHandlerIsValidClickStub.calledOnce);
    });

    it('should call endChrono() on endGame()', () => {
        const spy = sinon.spy(gameManagerService, <any>'endChrono');
        gameManagerService.endGame(serverSockets[FIRST_ARRAY_POSITION]);
        expect(spy.calledOnce);
    });

    // it('should handle a solo classic mode event and call setupNecessaryGameServices', (done) => {
    //     const spy = sinon.spy(socketManager, <any>'setupNecessaryGameServices');
    //     clientSocket.emit('solo classic mode', testGameName);
    //     setTimeout(() => {
    //         expect(spy.calledOnce);
    //         done();
    //     }, RESPONSE_DELAY * 5); // 1 seconde
    // });

    // it('should call emitTime on solo classic mode event', (done) => {
    //     const spy = sinon.spy(socketManager, <any>'emitTime');
    //     clientSocket.emit('solo classic mode', testGameName);
    //     setTimeout(() => {
    //         expect(spy.calledOnce);
    //         done();
    //     }, RESPONSE_DELAY * 5); // 1 seconde
    // });

    // it('should call getGameImagesData on solo classic mode event', (done) => {
    //     const spy = sinon.spy(GamesService.prototype, 'getGameImagesData');
    //     clientSocket.emit('solo classic mode', testGameName);
    //     setTimeout(() => {
    //         expect(spy.calledOnce);
    //         done();
    //     }, RESPONSE_DELAY * 5); // 1 seconde
    // });

    // it('should emit a classic solo images event on solo classic mode event', (done) => {
    //     clientSocket.emit('solo classic mode', testGameName);
    //     clientSocket.once('classic solo images', (imagesDataReceived: string[]) => {
    //         expect(imagesDataReceived).to.exist;
    //         done();
    //     }); // 1 seconde
    // });
});
