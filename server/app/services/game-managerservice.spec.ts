import { NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { Server } from 'app/server';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';
import { SocketManager } from './socketManager.service';

describe('SocketManager service tests', () => {
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
    const imagesData: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray(1),
        modifiedImageData: new Uint8ClampedArray(1),
        imageHeight: 1,
        imageWidth: 1,
        offSet: 0,
    };
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    let chronometerService: ChronometerService = new ChronometerService();
    let gamesService: GamesService = Container.get(GamesService);
    let mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let mouseHandlerIsValidClickStub: sinon.SinonStub<[mousePosition: Position, plrSocketId: string], GameplayDifferenceInformations>;

    const urlString = 'http://localhost:3000';

    before(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);

        sinon.stub(SocketManager.prototype, <any>'getSocketChronometerService').callsFake((socket) => {
            return chronometerService;
        });

        sinon.stub(SocketManager.prototype, <any>'getSocketMouseHandlerService').callsFake((socket) => {
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
    });

    after(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('should handle a solo classic mode event and call generateDifferencesInformations', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'generateDifferencesInformations');
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a solo classic mode event and call setupSocketGameRoom', (done) => {
        const spy = sinon.spy(service, <any>'setupSocketGameRoom');
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a solo classic mode event and call setupNecessaryGameServices', (done) => {
        const spy = sinon.spy(service, <any>'setupNecessaryGameServices');
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should call emitTime on solo classic mode event', (done) => {
        const spy = sinon.spy(service, <any>'emitTime');
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should call getGameImagesData on solo classic mode event', (done) => {
        const spy = sinon.spy(GamesService.prototype, 'getGameImagesData');
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should emit a classic solo images event on solo classic mode event', (done) => {
        clientSocket.emit('solo classic mode', testGameName);
        clientSocket.once('classic solo images', (imagesDataReceived: string[]) => {
            expect(imagesDataReceived).to.exist;
            done();
        }); // 1 seconde
    });

    it('should handle a Verify position should call isValidClick from MouseHandlerService', (done) => {
        const positionTest = { x: 0, y: 0 };
        clientSocket.emit('Verify position', positionTest);
        setTimeout(() => {
            expect(mouseHandlerIsValidClickStub.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });
});
