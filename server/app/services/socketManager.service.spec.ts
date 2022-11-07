import { DifferencesInformations } from '@common/differences-informations';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { Server } from 'app/server';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { DifferenceDetectorService } from './difference-detector.service';
import { GameManagerService } from './game-manager.service';
import { MouseHandlerService } from './mouse-handler.service';
import { SocketManager } from './socketManager.service';
import { WaitingLineHandlerService } from './waiting-line-handler.service';

// À switch dans le fichier des constantes
const RESPONSE_DELAY = 200;

describe('SocketManager service tests', () => {
    const testGameName = 'test12345';
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
    let gameManagerServiceBeginGameStub: sinon.SinonStub<[socket: io.Socket, gameName: string, adversarySocket?: io.Socket], Promise<void>>;
    let gameManagerServiceClickResponseStub: sinon.SinonStub<[socket: io.Socket, mousePos: Position], void>;
    let waitingLineHandlerService: WaitingLineHandlerService = new WaitingLineHandlerService();
    const urlString = 'http://localhost:3000';

    before(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
    });

    beforeEach(() => {
        sinon.stub(GameManagerService.prototype, <any>'getSocketMouseHandlerService').callsFake((socket) => {
            return mouseHandlerService;
        });
        gameManagerServiceBeginGameStub = sinon.stub(GameManagerService.prototype, 'beginGame').callsFake(async () => {});
        sinon.stub(GameManagerService.prototype, 'endGame').callThrough();
        gameManagerServiceClickResponseStub = sinon.stub(GameManagerService.prototype, 'clickResponse').callsFake(() => {});
    });

    afterEach(() => {
        sinon.restore();
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

    it("should handle 'solo classic mode' event and return the game of the name that was launched", (done) => {
        clientSocket.emit('solo classic mode', testGameName);
        clientSocket.once('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(testGameName);
            done();
        });
    });

    it("should handle 'my username is' when the username is valid", (done) => {
        const validUsername = "user1234";
        const stubUsernamePlayer = sinon.stub(WaitingLineHandlerService.prototype, <any>'setUsernamePlayer').callsFake(() => {});
        clientSocket.emit('my username is', validUsername);
        setTimeout(() => {
            expect(stubUsernamePlayer.calledOnce);
            done();
        }, RESPONSE_DELAY * 5);
    });

    it("should handle 'my username is' when the username is invalid", (done) => {
        const invalidUsername = " user1234";
        const emitSpy = sinon.spy(clientSocket, 'emit');
        clientSocket.emit('my username is', invalidUsername);
        setTimeout(() => {
            expect(emitSpy.alwaysCalledWithExactly("username not valid"));
            done();
        }, RESPONSE_DELAY * 5);
    });

    it("should handle 'I am waiting event' and call addCreatingPlayer", (done) => {
        const addCreatingPlayerSpy = sinon.spy(waitingLineHandlerService, 'addCreatingPlayer');
        clientSocket.emit('I am waiting', testGameName);
        const emitSpy = sinon.spy(clientSocket, 'emit');
        setTimeout(() => {
            expect(addCreatingPlayerSpy.calledOnce).to.be.true;
            console.log(addCreatingPlayerSpy.called);
            expect(emitSpy.alwaysCalledWithExactly(`${testGameName} let me tell you if someone is waiting`, true)).to.be.true;
            console.log(emitSpy.alwaysCalledWithExactly(`${testGameName} let me tell you if someone is waiting`, true));
            done();
        }, RESPONSE_DELAY * 5);
    });

    // Test passe pas
    it("should handle 'username is' event and emit a show the username event", (done) => {
        const usernameTest = 'Test username';
        clientSocket.emit('username is', usernameTest);
        clientSocket.once('show the username', (username: string) => {
            expect(username).to.equal(usernameTest);
            done();
        });
    });

    // Test passe pas
    it("should handle 'verify position' event and call clickResponse", (done) => {
        let positionTest: Position = {
            x: 0,
            y: 0,
        };
        clientSocket.emit('Verify position', positionTest);
        clientSocket.once('Valid click', () => {
            expect(gameManagerServiceClickResponseStub.calledOnce);
            done();
        });
    });

    it("should handle 'solo classic mode event' and return the game of the name that was launched", (done) => {
        clientSocket.emit('solo classic mode', testGameName);
        clientSocket.once('The game is', (nameOfGame: string) => {
            expect(nameOfGame).to.equal(testGameName);
            done();
        });
    });

    it("should handle 'solo classic mode' event and call beginGame", (done) => {
        clientSocket.emit('solo classic mode', testGameName);
        setTimeout(() => {
            expect(gameManagerServiceBeginGameStub.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it("should handle 'is there someone waiting' event", (done) => {
        clientSocket.emit('is there someone waiting', testGameName);
        done();
    });

    it("should handle 'detect images difference' event and call generateDifferencesList", (done) => {
        const spy = sinon.spy(differenceDetectorService, 'generateDifferencesList');
        clientSocket.emit('detect images difference', imagesData);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it("should handle 'detect images difference' event and call getNbDifferences", (done) => {
        const spy = sinon.spy(differenceDetectorService, 'getNbDifferences');
        clientSocket.emit('detect images difference', imagesData);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it("should handle 'detect images difference' event and emit a game creation differences informations event", (done) => {
        clientSocket.emit('detect images difference', imagesData);
        clientSocket.once('game creation differences informations', (differencesInfos: DifferencesInformations) => {
            expect(differencesInfos).to.exist;
            done();
        }); // 1 seconde
    });

    it("should handle 'Check if game is finished' on finished game and call resetData", (done) => {
        const spy = sinon.spy(mouseHandlerService, 'resetData');
        mouseHandlerService.addPlayerToGame(clientSocket.id);
        clientSocket.emit('Check if game is finished', true);
        setTimeout(() => {
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY * 5); // 1 seconde
    });

    it("should handle 'kill the game' and call handleAbandonEmit and endGame", (done) => {
        const stubAbandon = sinon.stub(GameManagerService.prototype, <any>'handleAbandonEmit').callsFake(() => {});
        clientSocket.emit('kill the game');
        setTimeout(() => {
            expect(stubAbandon.calledOnce);
            done();
        }, RESPONSE_DELAY * 5);
    });

    it("should handle 'Check if game is finished' and end the game", () => {
        const stub = sinon.stub(GameManagerService.prototype, <any>'isGameFinishedMulti').callsFake(() => {
            return true;
        });
        clientSocket.emit('Check if game is finished');
        expect(stub.calledOnce);
    });

    it("should handle 'playerMessage' and send a message", () => {
        const stub = sinon.stub(GameManagerService.prototype, <any>'findSocketGameRoomName').callsFake(() => {});
        clientSocket.emit('playerMessage', '');
        expect(stub.calledOnce);
    });
});
