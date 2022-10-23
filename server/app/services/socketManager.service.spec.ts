import { NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { DifferencesInformations } from '@common/differences-informations';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
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
    let differenceDetectorService: DifferenceDetectorService = new DifferenceDetectorService(imagesData);
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

    it('should handle a game page event and return the game of the name that was launched', (done) => {
        clientSocket.emit('game page', testGameName);
        clientSocket.once('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(testGameName);
            done();
        });
    });

    it('should handle a username is event and emit a show the username event', (done) => {
        const usernameTest = 'Test username';
        clientSocket.emit('username is', usernameTest);
        clientSocket.once('show the username', (username: string) => {
            expect(username).to.equal(usernameTest);
            done();
        });
    });

    it('should handle a verify position event and call clickResponse', (done) => {
        let positionTest: Position = {
            x: 0,
            y: 0,
        };
        const spy = sinon.spy(service, <any>'clickResponse');
        clientSocket.emit('Verify position', positionTest);
        clientSocket.once('Valid click', () => {
            expect(mouseHandlerIsValidClickStub.callsFake);
            expect(spy.calledOnce);
            done();
        });
    });

    it('should handle a game page event and return the game of the name that was launched', (done) => {
        clientSocket.emit('game page', testGameName);
        clientSocket.once('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(testGameName);
            done();
        });
    });

    it('should handle a game page event and call beginGame', (done) => {
        const spy = sinon.spy(service, <any>'beginGame');
        clientSocket.emit('game page', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a game page event and call generateDifferencesInformations', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'generateDifferencesInformations');
        clientSocket.emit('game page', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a game page event and call setupSocketRoom', (done) => {
        const spy = sinon.spy(service, <any>'setupSocketRoom');
        clientSocket.emit('game page', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should handle a game page event and call setupNecessaryGameServices', (done) => {
        const spy = sinon.spy(service, <any>'setupNecessaryGameServices');
        clientSocket.emit('game page', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should call emitTime on game page event', (done) => {
        const spy = sinon.spy(service, <any>'emitTime');
        clientSocket.emit('game page', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should call getGameImagesData on game page event', (done) => {
        const spy = sinon.spy(GamesService.prototype, 'getGameImagesData');
        clientSocket.emit('game page', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it('should emit a classic solo images event on game page event', (done) => {
        clientSocket.emit('game page', testGameName);
        clientSocket.once('classic solo images', (imagesDataReceived: string[]) => {
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
        clientSocket.once('game creation differences informations', (differencesInfos: DifferencesInformations) => {
            expect(differencesInfos).to.exist;
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

    it('should handle a Check if game is finished on finished game and call resetData', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'resetData');
        clientSocket.emit('Check if game is finished');
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });
});
