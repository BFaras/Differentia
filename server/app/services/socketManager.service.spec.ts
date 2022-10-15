import { DifferencesInformations } from '@common/differences-informations';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { ChronometerService } from './chronometer.service';
import { DifferenceDetectorService } from './difference-detector.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';
import { SocketManager } from './socketManager.service';

// À switch dans le fichier des constantes
const RESPONSE_DELAY = 200;

describe('SocketManager service tests', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    let chronometerService: ChronometerService = new ChronometerService();

    const imagesData: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray(1),
        modifiedImageData: new Uint8ClampedArray(1),
        imageHeight: 1,
        imageWidth: 1,
        offSet: 0,
    };
    let differenceDetectorService: DifferenceDetectorService = new DifferenceDetectorService(imagesData);
    let gamesService: GamesService = Container.get(GamesService);
    let mouseHandlerService: MouseHandlerService = new MouseHandlerService();

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
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
    });

    afterEach(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('should handle a message event print it to console', (done) => {
        const spy = sinon.spy(console, 'log');
        const testMessage = 'Hello World';
        clientSocket.emit('message', testMessage);
        setTimeout(() => {
            assert(spy.called);
            assert(spy.calledWith(testMessage));
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a kill the timer event and stop the chronometer', (done) => {
        const spy = sinon.spy(chronometerService, 'resetChrono');
        clientSocket.emit('kill the timer');
        setTimeout(() => {
            expect(spy.calledOnce);
            expect(chronometerService.time.minutes).to.equal(0);
            expect(chronometerService.time.seconds).to.equal(0);
            done();
        }, RESPONSE_DELAY);
    });

    it('should handle a game page event and return the game of the name that was launched', (done) => {
        const gameName = 'Car game';
        clientSocket.emit('game page', gameName);
        clientSocket.on('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(gameName);
            done();
        });
    });

    it('should handle a username is event and emit a show the username event', (done) => {
        const usernameTest = 'Test username';
        clientSocket.emit('username is', usernameTest);
        clientSocket.on('show the username', (username: string) => {
            expect(username).to.equal(usernameTest);
            done();
        });
    });

    it('should handle a verify position event and call clickResponse', (done) => {
        let positionTest: Position = {
            x: 0,
            y: 0,
        };
        const stub = sinon.stub(MouseHandlerService.prototype, 'isValidClick').callsFake((positionTest) => {
            return [];
        });
        const spy = sinon.spy(service, <any>'clickResponse');
        clientSocket.emit('Verify position', positionTest);
        clientSocket.on('Valid click', () => {
            expect(stub.callsFake);
            expect(spy.calledOnce);
            done();
        });
    });

    it('should handle a game page event and return the game of the name that was launched', (done) => {
        const gameName = 'Car game';
        clientSocket.emit('game page', gameName);
        clientSocket.on('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(gameName);
            done();
        });
    });

    it('should handle a game page event and call generateDifferencesInformations', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'generateDifferencesInformations');
        clientSocket.emit('game page', 'new game');
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should call emitTime on game page event', (done) => {
        const gameName = 'Car game';
        const spy = sinon.spy(service, <any>'emitTime');
        clientSocket.emit('game page', gameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should call getGameImagesData on game page event', (done) => {
        const gameName = 'Car game';
        const spy = sinon.spy(gamesService, 'getGameImagesData');
        clientSocket.emit('game page', gameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should emit a classic solo images event on game page event', (done) => {
        const gameName = 'Car game';
        clientSocket.emit('game page', gameName);
        clientSocket.on('classic solo images', (imagesDataReceived: string[]) => {
            expect(imagesDataReceived).to.exist;
            done();
        }); // 1 seconde
    });

    it('should handle a detect images difference event and call generateDifferencesList', (done) => {
        const spy = sinon.spy(differenceDetectorService, 'generateDifferencesList');
        clientSocket.emit('detect images difference', imagesData);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a detect images difference event and call getNbDifferences', (done) => {
        const spy = sinon.spy(differenceDetectorService, 'getNbDifferences');
        clientSocket.emit('detect images difference', imagesData);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a detect images difference event and emit a game creation differences informations event', (done) => {
        clientSocket.emit('detect images difference', imagesData);
        clientSocket.on('game creation differences informations', (differencesInfos: DifferencesInformations) => {
            expect(differencesInfos).to.exist;
            done();
        }); // 1 seconde
    });

    it('should handle a Verify position should call isValidClick from MouseHandlerService', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'isValidClick');
        const positionTest = { x: 0, y: 0 };
        clientSocket.emit('Verify position', positionTest);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a Check if game is finished on finished game and call resetData', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'resetData');
        clientSocket.emit('Check if game is finished');
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });
});
