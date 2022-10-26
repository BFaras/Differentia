import { DifferencesInformations } from '@common/differences-informations';
import { Game } from '@common/game';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { DifferenceDetectorService } from './difference-detector.service';
import { GameManagerService } from './game-manager.service';
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
    let differenceDetectorService: DifferenceDetectorService = new DifferenceDetectorService(imagesData);
    let mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let gameManagerService: GameManagerService;

    const urlString = 'http://localhost:3000';

    before(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
        gameManagerService = new GameManagerService(service['sio']);
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

    it('should handle a solo classic mode event and return the game of the name that was launched', (done) => {
        clientSocket.emit('solo classic mode', testGameName);
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
        const spy = sinon.spy(gameManagerService, 'clickResponse');
        clientSocket.emit('Verify position', positionTest);
        clientSocket.once('Valid click', () => {
            expect(spy.calledOnce);
            done();
        });
    });

    it('should handle a solo classic mode event and return the game of the name that was launched', (done) => {
        clientSocket.emit('solo classic mode', testGameName);
        clientSocket.once('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(testGameName);
            done();
        });
    });

    it('should handle a solo classic mode event and call beginGame', (done) => {
        const spy = sinon.spy(gameManagerService, 'beginGame');
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
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

    it('should handle a Check if game is finished on finished game and call resetData', (done) => {
        const spy = sinon.spy(mouseHandlerService, 'resetData');
        mouseHandlerService.addPlayerToGame(clientSocket.id);
        clientSocket.emit('Check if game is finished');
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });
});
