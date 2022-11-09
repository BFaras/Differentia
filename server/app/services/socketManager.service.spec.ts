import { RESPONSE_DELAY } from '@app/server-consts';
import { DifferencesInformations } from '@common/differences-informations';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Server } from 'app/server';
import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { DifferenceDetectorService } from './difference-detector.service';
import { GameManagerService } from './game-manager.service';
import { MouseHandlerService } from './mouse-handler.service';
import { SocketManager } from './socketManager.service';
import { WaitingLineHandlerService } from './waiting-line-handler.service';
chai.use(chaiAsPromised);

describe('SocketManager service tests', () => {
    const testGameName = 'test12345';
    const validTestUsername = 'validTestUsername';
    const unvalidTestUsername = ' unvalidTestUsername';
    // const testSocketId = 'JKHSDA125';
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
    const differenceDetectorService: DifferenceDetectorService = new DifferenceDetectorService(imagesData);
    const mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let gameManagerServiceBeginGameStub: sinon.SinonStub<[socket: io.Socket, gameName: string, adversarySocket?: io.Socket], Promise<void>>;
    const waitingLineHandlerService: WaitingLineHandlerService = new WaitingLineHandlerService();
    

    const urlString = 'http://localhost:3000';

    before(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
    });

    beforeEach(() => {
        sinon.stub(GameManagerService.prototype, <any>'getSocketMouseHandlerService').callsFake(() => {
            return mouseHandlerService;
        });
        gameManagerServiceBeginGameStub = sinon.stub(GameManagerService.prototype, 'beginGame').callsFake(async () => {});
        // gameManagerServiceStartMultiplayerMatchStub = sinon.stub(GameManagerService.prototype, 'startMultiplayerMatch').callsFake(async () => {});
        sinon.stub(GameManagerService.prototype, 'endGame').callThrough();
        sinon.stub(GameManagerService.prototype, 'clickResponse').callsFake(() => {});
        sinon.stub(GameManagerService.prototype, 'getGameRooms').callsFake(() => {
            let testHashMap: Map<string, string[]> = new Map<string, string[]> ();
            testHashMap.set('Room1', ['Hello', 'Hi']);
            testHashMap.set('Room2', ['Hello1234', 'Hi1234']);
            return testHashMap;
        });
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
        const validUsername = 'user1234';
        const spyUsernamePlayer = sinon.spy(waitingLineHandlerService, 'setUsernamePlayer');
        clientSocket.emit('my username is', validUsername);
        clientSocket.once('username valid', () => {
            expect(spyUsernamePlayer.calledOnce);
            done();
        });
    });

    it("should handle 'my username is' when the username is invalid", (done) => {
        const invalidUsername = ' user1234';
        clientSocket.emit('my username is', invalidUsername);
        clientSocket.once('username not valid', () => {
            done();
        });
    });

    it("should handle 'I am waiting event' and call addCreatingPlayer", (done) => {
        const addCreatingPlayerSpy = sinon.spy(waitingLineHandlerService, 'addCreatingPlayer');
        clientSocket.emit('I am waiting', testGameName);
        clientSocket.once(`${testGameName} let me tell you if someone is waiting`, (isSomeoneWaiting: boolean) => {
            expect(addCreatingPlayerSpy.calledOnce);
            expect(isSomeoneWaiting).to.equal(true);
            done();
        });
    });

    it("should handle 'I left' event, call deleteCreatorOfGame and sendEventToAllJoiningPlayers", (done) => {
        const deleteCreatorOfGameSpy = sinon.spy(waitingLineHandlerService, 'deleteCreatorOfGame');
        const sendEventToAllSpy = sinon.spy(waitingLineHandlerService, 'sendEventToAllJoiningPlayers');
        clientSocket.emit('I left', testGameName);
        clientSocket.once(`${testGameName} nobody is waiting no more`, () => {
            expect(deleteCreatorOfGameSpy.calledOnce);
            expect(sendEventToAllSpy.calledOnce);
            done();
        });
    });

    it("should handle 'need reconnection' event and emit to clients", (done) => {
        clientSocket.emit('need reconnection');
        clientSocket.once('reconnect', () => {
            done();
        });
    });

    // Done
    it("should handle 'Is the host still there' event when there is a creator player ", (done) => {
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        clientSocket.emit('Is the host still there', testGameName);
        clientSocket.once(`${testGameName} response on host presence`, (isHostPresent: boolean) => {
            expect(isHostPresent).to.equal(true);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
            done();
        });
    });

    it("should handle 'Is the host still there' event when there is not a creator player ", (done) => {
        clientSocket.emit('Is the host still there', testGameName);
        clientSocket.once(`${testGameName} response on host presence`, (isHostPresent: boolean) => {
            expect(isHostPresent).to.equal(false);
            done();
        });
    });

    it("should handle 'Reload game selection page' event", (done) => {
        const testMsg = "Hello";
        clientSocket.emit('Reload game selection page', testMsg);
        clientSocket.once('Page reloaded', (message: string) => {
            expect(message).to.equal(testMsg);
            done();
        });
    });

    it("should handle 'I am trying to join' event and call addJoiningPlayer and getCreatorPlayer", (done) => {
        const testGameInfoAndUsername: string[] = [testGameName, validTestUsername];
        service['waitingLineHandlerService'].addCreatingPlayer(testGameInfoAndUsername[0], clientSocket.id);
        const addJoiningPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'addJoiningPlayer');
        const getCreatorPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'getCreatorPlayer');

        clientSocket.emit('I am trying to join', testGameInfoAndUsername);
        clientSocket.once(`${testGameInfoAndUsername[0]} someone is trying to join`, () => {
            expect(addJoiningPlayerSpy.calledOnce);
            expect(getCreatorPlayerSpy.calledOnce);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameInfoAndUsername[0]);
            done();
        });
    });

    it("should handle 'I dont want to join anymore' event and call deleteJoiningPlayer", () => {
        const deleteJoiningPlayerSpy = sinon.spy(waitingLineHandlerService, 'deleteJoiningPlayer');
        const getCreatorPlayerSpy = sinon.spy(waitingLineHandlerService, 'getCreatorPlayer');

        clientSocket.emit('I dont want to join anymore', testGameName);
        expect(deleteJoiningPlayerSpy.calledOnce);
        expect(getCreatorPlayerSpy.calledOnce);
    });

    it("should handle 'I dont want to join anymore' event and tell the creator if there is someone else waiting", (done) => {
        sinon.stub(service['waitingLineHandlerService'], 'deleteJoiningPlayer').callsFake(() => {});
        const getPresenceOfJoiningPlayersSpy = sinon.spy(service['waitingLineHandlerService'], 'getIDFirstPlayerWaiting');
        const updateJoiningPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'updateJoiningPlayer');
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        service['waitingLineHandlerService'].addJoiningPlayer(clientSocket.id, [testGameName]);
        clientSocket.emit('I dont want to join anymore', testGameName);
        clientSocket.once(`${testGameName} someone is trying to join`, () => {
            expect(getPresenceOfJoiningPlayersSpy.calledOnce);
            expect(updateJoiningPlayerSpy.calledOnce);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
            sinon.restore();
            service['waitingLineHandlerService'].deleteJoiningPlayer(clientSocket.id, testGameName);
            done();
        });
    });

    it("should handle 'launch classic mode multiplayer match' event", () => {
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        const getIDFirstPlayerWaitingSpy = sinon.spy(waitingLineHandlerService, 'getIDFirstPlayerWaiting');
        const deleteJoiningPlayerSpy = sinon.spy(waitingLineHandlerService, 'deleteJoiningPlayer');
        const deleteCreatorOfGameSpy = sinon.spy(waitingLineHandlerService, 'deleteCreatorOfGame');
        const sendEventToAllJoiningPlayersSpy = sinon.spy(waitingLineHandlerService, 'sendEventToAllJoiningPlayers');
        const stub = sinon.stub(GameManagerService.prototype, <any>'startMultiplayerMatch').callsFake(() => {});

        clientSocket.emit('launch classic mode multiplayer match', testGameName);
        expect(stub.calledOnce);

        expect(getIDFirstPlayerWaitingSpy.calledOnce);
        expect(deleteJoiningPlayerSpy.calledOnce);
        expect(deleteCreatorOfGameSpy.calledOnce);
        expect(sendEventToAllJoiningPlayersSpy.calledOnce);
        service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
    });

    it("should handle 'launch classic mode multiplayer match' event and tell the other joining players that the host started a match", (done) => {
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        service['waitingLineHandlerService'].addJoiningPlayer(testGameName, [testGameName]);
        sinon.stub(GameManagerService.prototype, <any>'startMultiplayerMatch').callsFake(() => {});
        sinon.stub(service['waitingLineHandlerService'], 'deleteJoiningPlayer').callsFake(() => {});

        clientSocket.emit('launch classic mode multiplayer match', testGameName);

        clientSocket.on(`${testGameName} nobody is waiting no more`, () => {
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
            sinon.restore();
            service['waitingLineHandlerService'].deleteJoiningPlayer(clientSocket.id, testGameName);
            done();
        });
    });

    it("should handle 'I refuse this adversary' event", () => {
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        service['waitingLineHandlerService'].addJoiningPlayer(clientSocket.id, [testGameName]);
        const getIDSpy = sinon.spy(service['waitingLineHandlerService'], 'getIDFirstPlayerWaiting');
        const deleteJoiningPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'deleteJoiningPlayer');
        clientSocket.emit('I refuse this adversary', testGameName);
        clientSocket.once(`${testGameName} you have been declined`, (isDeclined: boolean) => {
            expect(getIDSpy.calledOnce);
            expect(deleteJoiningPlayerSpy.calledOnce);
            expect(isDeclined).to.equal(false);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
            service['waitingLineHandlerService'].deleteJoiningPlayer(clientSocket.id, testGameName);
        });
    });

    it("should handle 'I refuse this adversary' event and tell the creator that no one else is waiting", () => {
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        service['waitingLineHandlerService'].addJoiningPlayer(clientSocket.id, [testGameName]);
        const getIDSpy = sinon.spy(service['waitingLineHandlerService'], 'getIDFirstPlayerWaiting');
        const deleteJoiningPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'deleteJoiningPlayer');
        clientSocket.emit('I refuse this adversary', testGameName);
        clientSocket.once(`${testGameName} the player trying to join left`, () => {
            expect(getIDSpy.calledOnce);
            expect(deleteJoiningPlayerSpy.calledOnce);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
            service['waitingLineHandlerService'].deleteJoiningPlayer(clientSocket.id, testGameName);
        });
    });

    it("should handle 'my username is' event and emit a 'username valid' event when the username is valid", (done) => {
        clientSocket.emit('my username is', validTestUsername);
        clientSocket.once('username valid', () => {
            done();
        });
    });

    it("should handle 'my username is' event and emit a 'username not valid' event when the username is unvalid", (done) => {
        clientSocket.emit('my username is', unvalidTestUsername);
        clientSocket.once('username not valid', () => {
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

    it("should handle 'is there someone waiting' event", () => {
        service['waitingLineHandlerService'].addCreatingPlayer(testGameName, clientSocket.id);
        clientSocket.emit('is there someone waiting', testGameName);
        clientSocket.once(`${testGameName} let me tell you if someone is waiting`, (isSomeoneWaiting: boolean) => {
            expect(isSomeoneWaiting).to.equal(true);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameName);
        });
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
