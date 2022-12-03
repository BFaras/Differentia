/* eslint-disable max-lines */
import { RecordTime } from '@app/classes/record-times';
import { RESPONSE_DELAY, SOMEBODY_IS_WAITING } from '@app/server-consts';
import { CLASSIC_MODE, LIMITED_TIME_MODE, MSG_RESET_ALL_TIME, MSG_RESET_TIME } from '@common/const';
import { DifferencesInformations } from '@common/differences-informations';
import { Game } from '@common/game';
import { GameInfo } from '@common/gameInfo';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { Server } from 'app/server';
import * as chai from 'chai';
import { assert, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { BestTimesService } from './best-times.service';
import { ChronometerService } from './chronometer.service';
import { ClueManagerService } from './clue-manager.service';
import { RecordTimesService } from './database.games.service';
import { DifferenceDetectorService } from './difference-detector.service';
import { GameManagerService } from './game-manager.service';
import { GamesService } from './local.games.service';
import { MouseHandlerService } from './mouse-handler.service';
import { SocketManager } from './socketManager.service';
import { WaitingLineHandlerService } from './waiting-line-handler.service';
chai.use(chaiAsPromised);
let clickResponseStub: sinon.SinonStub;
let getGameRoomsStub: sinon.SinonStub;

describe('SocketManager service tests', () => {
    const testGameName = 'test12345';
    const validTestUsername = 'validTestUsername';
    const unvalidTestUsername = ' unvalidTestUsername';
    const imagesData: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray(1),
        modifiedImageData: new Uint8ClampedArray(1),
        imageHeight: 1,
        imageWidth: 1,
        offSet: 0,
    };
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
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    let clientSocketTwo: Socket;
    const differenceDetectorService: DifferenceDetectorService = new DifferenceDetectorService(imagesData);
    const mouseHandlerService: MouseHandlerService = new MouseHandlerService();
    let gameManagerServiceBeginGameStub: sinon.SinonStub<[gameInfo: GameInfo], Promise<void>>;
    const waitingLineHandlerService: WaitingLineHandlerService = new WaitingLineHandlerService();
    let gameManagerServiceEndGameStub: sinon.SinonStub;

    const urlString = 'http://localhost:3000';

    before(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManager'];
        clientSocket = ioClient(urlString);
        clientSocketTwo = ioClient(urlString);
    });

    beforeEach(() => {
        sinon.stub(GameManagerService.prototype, <any>'getSocketMouseHandlerService').callsFake(() => {
            return mouseHandlerService;
        });
        gameManagerServiceBeginGameStub = sinon.stub(GameManagerService.prototype, 'beginGame').callsFake(async () => {});
        gameManagerServiceEndGameStub = sinon.stub(GameManagerService.prototype, 'endGame').callThrough();
        clickResponseStub = sinon.stub(GameManagerService.prototype, 'clickResponse').callsFake(() => {});
        getGameRoomsStub = sinon.stub(GameManagerService.prototype, 'getGameRooms').callsFake(() => {
            const testHashMap: Map<string, string[]> = new Map<string, string[]>();
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
        clientSocketTwo.close();
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

    it("should handle 'Reset game list' event", (done) => {
        const gameManagerServiceSPy = sinon.stub(GameManagerService.prototype, 'resetGameList').callsFake(async () => {
            return [];
        });
        clientSocket.emit('Reset game list');
        clientSocket.once('Ready to reset game list', (message) => {
            expect(message).to.equal([]);
            expect(gameManagerServiceSPy.calledOnce);
            done();
        });
    });

    it("should handle 'Reset game times board' event", (done) => {
        let value = 'car game';
        const recordsServiceSPy = sinon.spy(RecordTimesService.prototype, <any>'resetGameRecordTimes');
        clientSocket.emit('Reset records time board', value);
        clientSocket.once('Page reloaded', (message: string) => {
            expect(message).to.equal(MSG_RESET_TIME + value);
            expect(recordsServiceSPy.calledOnce);
            done();
        });
    });

    it("should handle 'Reset all games times board' event", (done) => {
        const recordsServiceSPy = sinon.spy(RecordTimesService.prototype, <any>'resetAllGamesRecordTimes');
        clientSocket.emit('Reset records time board');
        clientSocket.once('Page reloaded', (message: string) => {
            expect(message).to.equal(MSG_RESET_ALL_TIME);
            expect(recordsServiceSPy.calledOnce);
            done();
        });
    });

    it("should handle 'Set time constants' event", (done) => {
        let value = 'car game';
        const recordsServiceSPy = sinon.spy(RecordTimesService.prototype, <any>'resetGameRecordTimes');
        clientSocket.emit('Set time constants', value);
        clientSocket.once('Page reloaded', (message: string) => {
            expect(message).to.equal(MSG_RESET_TIME + value);
            expect(recordsServiceSPy.calledOnce);
            done();
        });
    });

    it("should handle 'refresh games after closing popDialog' event", (done) => {
        const value = 'Blue';
        clientSocket.emit('refresh games after closing popDialog', value);
        clientSocket.once('game list updated', (message: string) => {
            expect(message).to.equal(value);
            done();
        });
    });

    it("should handle 'Reload game selection page' event", (done) => {
        const testMsg = 'Hello';
        const gameManagerServiceSPy = sinon.spy(GameManagerService.prototype, <any>'collectAllSocketsRooms');
        clientSocket.emit('Reload game selection page', testMsg);
        clientSocket.once('Page reloaded', (message: string) => {
            expect(message).to.equal(testMsg);
            expect(gameManagerServiceSPy.calledOnce);
            done();
        });
    });

    it("should handle 'I am trying to join' event and call addJoiningPlayer and getCreatorPlayer", () => {
        const testGameInfoAndUsername: string[] = [testGameName, validTestUsername];
        service['waitingLineHandlerService'].addCreatingPlayer(testGameInfoAndUsername[0], clientSocket.id);
        const addJoiningPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'addJoiningPlayer');
        const getCreatorPlayerSpy = sinon.spy(service['waitingLineHandlerService'], 'getCreatorPlayer');

        clientSocket.emit('I am trying to join', testGameInfoAndUsername);
        clientSocket.once(`${testGameInfoAndUsername[0]} someone is trying to join`, () => {
            expect(addJoiningPlayerSpy.calledOnce);
            expect(getCreatorPlayerSpy.calledOnce);
            service['waitingLineHandlerService'].deleteCreatorOfGame(testGameInfoAndUsername[0]);
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
        service['waitingLineHandlerService'].addJoiningPlayer(clientSocket.id, testGameName);
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
        service['waitingLineHandlerService'].addJoiningPlayer(testGameName, testGameName);
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
        service['waitingLineHandlerService'].addJoiningPlayer(clientSocket.id, testGameName);
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
        service['waitingLineHandlerService'].addJoiningPlayer(clientSocket.id, testGameName);
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

    // it("should handle 'Check if game is finished' on finished game and call resetDifferencesData", (done) => {
    //     const spy = sinon.spy(mouseHandlerService, 'resetDifferencesData');
    //     mouseHandlerService.addPlayerToGame(clientSocket.id);
    //     clientSocket.emit('Check if game is finished', true);
    //     setTimeout(() => {
    //         expect(spy.calledOnce);
    //         done();
    //     }, RESPONSE_DELAY * 5); // 1 seconde
    // });

    it("should handle 'kill the game' and call handleAbandonEmit and endGame", (done) => {
        const stubAbandon = sinon.stub(GameManagerService.prototype, <any>'handleAbandonEmit').callsFake(() => {});
        clientSocket.emit('kill the game');
        setTimeout(() => {
            expect(stubAbandon.calledOnce);
            done();
        }, RESPONSE_DELAY * 5);
    });

    it("should handle 'Cheat key pressed' and call sendDifferentPixelsNotFound", (done) => {
        const stubDifference = sinon.stub(GameManagerService.prototype, <any>'sendDifferentPixelsNotFound').callsFake(() => {});
        clientSocket.emit('Cheat key pressed');
        setTimeout(() => {
            expect(stubDifference.calledOnce);
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

    it("should handle 'Reload game selection page' and call getGameRooms", () => {
        clientSocket.emit('Reload game selection page', '');
        expect(getGameRoomsStub.calledOnce);
    });

    it("should handle 'Verify' and call click response", () => {
        const position: Position = { x: 0, y: 0 };
        clientSocket.emit('Verify position', position);
        expect(clickResponseStub.calledOnce);
    });

    it("should handle 'get clue for player' and call sendClueToPlayerSocket() from ClueManagerService", () => {
        const stub = sinon.stub(ClueManagerService.prototype, 'sendClueToPlayer').callsFake(() => {});
        clientSocket.emit('get clue for player');
        expect(stub.calledOnce);
    });

    // eslint-disable-next-line max-len
    it("should handle 'solo limited time mode' and call getUsername, generateRandomGame, startLimitedTimeSocketGameHistory, beginGame", async () => {
        const getUsernamePlayerStub = sinon.stub(WaitingLineHandlerService.prototype, 'getUsernamePlayer').callsFake((socket, server) => {
            return validTestUsername;
        });
        const generateRandomGameStub = sinon.stub(GamesService.prototype, 'generateRandomGame').callsFake(async (gamesAlreadyPlayed) => {
            return Promise.resolve(testGame);
        });
        const startLimitedTimeSocketGameHistoryStub = sinon
            .stub(GameManagerService.prototype, 'startLimitedTimeSocketGameHistory')
            .callsFake(() => {});
        clientSocket.emit('solo limited time mode');
        clientSocket.once(LIMITED_TIME_MODE, () => {
            expect(getUsernamePlayerStub.calledOnce);
            expect(generateRandomGameStub.calledOnce);
            expect(startLimitedTimeSocketGameHistoryStub.calledOnce);
            expect(gameManagerServiceBeginGameStub.calledOnce);
        });
    });

    it("should handle 'gameMode is' and send Classic Mode event if the classic Flag is true", (done) => {
        clientSocket.emit('gameMode is', true);
        clientSocket.once(CLASSIC_MODE, () => {
            done();
        });
    });

    it("should handle 'gameMode is' and send open the ${LIMITED_TIME_MODE} pop-dialog event if the classic Flag is false", (done) => {
        clientSocket.emit('gameMode is', false);
        clientSocket.once(`open the ${LIMITED_TIME_MODE} pop-dialog`, () => {
            done();
        });
    });

    it("should handle 'I am trying to play a limited time game' and send response on limited time waiting line with SOMEBODY_IS_WAITING", () => {
        service['waitingLineHandlerService'].addLimitedTimeWaitingPlayer(clientSocketTwo.id);
        const isSomebodyWaitingForALimitedTimeGameSpy = sinon.spy(WaitingLineHandlerService.prototype, 'isSomebodyWaitingForALimitedTimeGame');
        const getLimitedTimeWaitingPlayerIdSpy = sinon.spy(WaitingLineHandlerService.prototype, 'getLimitedTimeWaitingPlayerId');
        clientSocket.emit('I am trying to play a limited time game');
        clientSocket.once('response on limited time waiting line', (response: boolean) => {
            expect(response).to.equal(SOMEBODY_IS_WAITING);
            expect(isSomebodyWaitingForALimitedTimeGameSpy.calledOnce);
            expect(getLimitedTimeWaitingPlayerIdSpy.calledOnce);
        });
        clientSocketTwo.once('response on limited time waiting line', (response: boolean) => {
            expect(response).to.equal(SOMEBODY_IS_WAITING);
            service['waitingLineHandlerService'].resetLimitedTimeWaitingLine();
        });
    });

    it("should handle 'I am trying to play a limited time game' and send response on limited time waiting line with !SOMEBODY_IS_WAITING", () => {
        const isSomebodyWaitingForALimitedTimeGameSpy = sinon.spy(WaitingLineHandlerService.prototype, 'isSomebodyWaitingForALimitedTimeGame');
        const addLimitedTimeWaitingPlayerSpy = sinon.spy(WaitingLineHandlerService.prototype, 'addLimitedTimeWaitingPlayer');
        clientSocket.emit('I am trying to play a limited time game');
        clientSocket.once('response on limited time waiting line', (response: boolean) => {
            expect(response).to.equal(!SOMEBODY_IS_WAITING);
            expect(isSomebodyWaitingForALimitedTimeGameSpy.calledOnce);
            expect(addLimitedTimeWaitingPlayerSpy.calledOnce);
        });
    });

    it("should handle 'I left from LM' and call resetLimitedTimeWaitingLine", () => {
        const resetLimitedTimeWaitingLineSpy = sinon.spy(WaitingLineHandlerService.prototype, 'resetLimitedTimeWaitingLine');
        clientSocket.emit('I left from LM');
        expect(resetLimitedTimeWaitingLineSpy.calledOnce);
    });

    it("should handle 'I left from LM' and call resetLimitedTimeWaitingLine", () => {
        service['waitingLineHandlerService'].addLimitedTimeWaitingPlayer(clientSocketTwo.id);
        const getSocketByIDSpy = sinon.spy(WaitingLineHandlerService.prototype, 'getSocketByID');
        const getLimitedTimeWaitingPlayerIdSpy = sinon.spy(WaitingLineHandlerService.prototype, 'getLimitedTimeWaitingPlayerId');
        const resetLimitedTimeWaitingLineSpy = sinon.spy(WaitingLineHandlerService.prototype, 'resetLimitedTimeWaitingLine');
        const generateRandomGameSpy = sinon.spy(GamesService.prototype, 'generateRandomGame');
        const startLimitedTimeSocketGameHistorySpy = sinon.spy(GameManagerService.prototype, 'startLimitedTimeSocketGameHistory');
        const startMultiplayerMatchSpy = sinon.spy(GameManagerService.prototype, 'startMultiplayerMatch');
        clientSocket.emit('launch limited time mode multiplayer match');
        clientSocket.once('The game is', () => {
            expect(getSocketByIDSpy.calledOnce);
            expect(resetLimitedTimeWaitingLineSpy.calledOnce);
            expect(getLimitedTimeWaitingPlayerIdSpy.calledOnce);
        });
        clientSocketTwo.once('The game is', () => {
            expect(generateRandomGameSpy.calledOnce);
            expect(startLimitedTimeSocketGameHistorySpy.calledOnce);
            expect(startMultiplayerMatchSpy.calledOnce);
            service['waitingLineHandlerService'].resetLimitedTimeWaitingLine();
        });
    });

    it("should handle 'Check if game is finished' and call doWeHaveToSwitchGame when the match is not finished", () => {
        const doWeHaveToSwitchGameSpy = sinon.spy(GameManagerService.prototype, 'doWeHaveToSwitchGame');
        clientSocket.emit('Check if game is finished');
        expect(doWeHaveToSwitchGameSpy.calledOnce);
    });

    it("should handle 'Check if game is finished' and call doWeHaveToSwitchGame when the match is not finished", (done) => {
        const chronometerServiceTest = new ChronometerService();
        chronometerServiceTest.mode = CLASSIC_MODE;
        mouseHandlerService.nbDifferencesTotal = 0;
        mouseHandlerService['differenceAmountFoundByPlayer'].set(clientSocket.id, 0);
        service['gameManagerService']['chronometerServices'].set(clientSocket.id + 'GameRoom', chronometerServiceTest);
        service['gameManagerService']['mouseHandlerServices'].set(clientSocket.id + 'GameRoom', mouseHandlerService);
        mouseHandlerService.nbDifferencesTotal = 0;
        const resetDifferencesDataSpy = sinon.spy(MouseHandlerService.prototype, 'resetDifferencesData');
        const resetLimitedTimeWaitingLineSpy = sinon.stub(BestTimesService.prototype, 'compareGameTimeWithDbTimes').callsFake(async () => {
            return Promise.resolve();
        });
        const handleEndGameEmitsSpy = sinon.spy(GameManagerService.prototype, 'handleEndGameEmits');
        clientSocket.emit('Check if game is finished', false);
        setTimeout(() => {
            expect(resetDifferencesDataSpy.calledOnce);
            expect(resetLimitedTimeWaitingLineSpy.calledOnce);
            expect(handleEndGameEmitsSpy.notCalled);
            expect(gameManagerServiceEndGameStub.calledOnce);
            mouseHandlerService['differenceAmountFoundByPlayer'].delete(clientSocket.id);
            service['gameManagerService']['chronometerServices'].delete(clientSocket.id + 'GameRoom');
            service['gameManagerService']['mouseHandlerServices'].delete(clientSocket.id + 'GameRoom');
            done();
        }, RESPONSE_DELAY);
    });
});
