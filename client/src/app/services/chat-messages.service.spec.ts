import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatMessage } from '@common/chat-message';
import {
    ABANDON_MESSAGE,
    DEFAULT_USERNAME,
    MESSAGE_DIFFERENCE_FOUND_MULTI,
    MESSAGE_DIFFERENCE_FOUND_SOLO,
    MESSAGE_ERROR_DIFFERENCE_MULTI,
    MESSAGE_ERROR_DIFFERENCE_SOLO,
    NO_DIFFERENCE_FOUND_ARRAY,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Subscription } from 'rxjs';

import { Socket } from 'socket.io-client';
import { ChatMessagesService } from './chat-messages.service';
import { SocketClientService } from './socket-client.service';

describe('ChatMessagesService', () => {
    const littleTimeout = 100;
    const emptySubcriberCallbackTest = (message: ChatMessage) => {};
    const putResponseInVariableCallback = (message: ChatMessage) => {
        messageReceivedFromObservable = message;
    };
    const testSocketId = 'HSTW263H';
    const testMessageTime = '00:00:00';
    const message = 'test message';
    const notValidClickInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: NO_DIFFERENCE_FOUND_ARRAY,
        isValidDifference: false,
        socketId: testSocketId,
        playerUsername: DEFAULT_USERNAME,
    };
    const differencesFoundInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: [0],
        isValidDifference: true,
        socketId: testSocketId,
        playerUsername: DEFAULT_USERNAME,
    };
    const messageFromPlayer: ChatMessage = {
        timeMessageSent: testMessageTime,
        senderName: DEFAULT_USERNAME,
        message: message,
    };
    let chatMessagesService: ChatMessagesService;
    let socketService: SocketClientService;
    let observer: Subscription;
    let socketTestHelper: SocketTestHelper;
    let messageReceivedFromObservable: ChatMessage;

    beforeAll(() => {
        TestBed.configureTestingModule({
        });
        socketService = TestBed.inject(SocketClientService);
        chatMessagesService = TestBed.inject(ChatMessagesService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    afterEach(() => {
        if (observer) {
        observer.unsubscribe();
        }
    });

    it('should call sendMessage', () => {
        const sendMessageSpy = spyOn(socketService, 'send').and.callThrough();
        chatMessagesService.sendMessage(DEFAULT_USERNAME, message);
        expect(sendMessageSpy).toHaveBeenCalled();
    });

    it('should create an observable which we can subscribe to on construction', () => {
        observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
        expect(observer).toBeTruthy;
    });

    it('should call create an observable and when we subscribe the callback will be called', () => {
        observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
        expect(emptySubcriberCallbackTest).toHaveBeenCalled;
    });

    it('should change the multiplayer game to true and set the adversary name on The adversary username is event', () => {
        const testAdversaryName = 'testName1234';
        socketTestHelper.peerSideEmit('The adversary username is', testAdversaryName);
        expect(chatMessagesService['isMultiplayerGame']).toBeTruthy();
        expect(chatMessagesService['adversaryUsername']).toEqual(testAdversaryName);
    });

    it('should send the solo error message when a Valid click event is sent and there is no difference found and the game is solo', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        chatMessagesService['isMultiplayerGame'] = false;
        socketTestHelper.peerSideEmit('Valid click', notValidClickInfo);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message).toEqual(MESSAGE_ERROR_DIFFERENCE_SOLO);
        }, littleTimeout);
    });

    it('should send solo the error message when a Valid click event is sent and there is no difference found and the game is solo', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        chatMessagesService['isMultiplayerGame'] = false;
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message).toEqual(MESSAGE_DIFFERENCE_FOUND_SOLO);
        }, littleTimeout);
    });

    it('should send the multiplayer error message when a Valid click event is sent and there is no difference found and the game is multiplayer', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        chatMessagesService['isMultiplayerGame'] = true;
        socketTestHelper.peerSideEmit('Valid click', notValidClickInfo);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message.includes(MESSAGE_ERROR_DIFFERENCE_MULTI)).toBeTruthy();
        }, littleTimeout);
    });

    it('should send multiplayer the error message when a Valid click event is sent and there is no difference found and the game is multiplayer', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        chatMessagesService['isMultiplayerGame'] = true;
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message.includes(MESSAGE_DIFFERENCE_FOUND_MULTI)).toBeTruthy();
        }, littleTimeout);
    });

    it('should send message to opponent when a chat event is sent in multiplayer game', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        chatMessagesService['isMultiplayerGame'] = true;
        socketTestHelper.peerSideEmit('Send message to opponent', messageFromPlayer);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message.includes(messageFromPlayer.message)).toBeTruthy();
        }, littleTimeout);
    });

    it('should send multiplayer the abandon message when a player abandonned the game', async () => {
        const endGameInfos: EndGameInformations = {
            isMultiplayer: true,
            isAbandon: true,
            isGameWon: true,
        };
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message.includes(ABANDON_MESSAGE)).toBeTruthy();
        }, littleTimeout);
    });

    it('should reset isMultiplayerGame to false on resetIsMultiplayer()', async () => {
        chatMessagesService.resetIsMultiplayer();
        expect(chatMessagesService['isMultiplayerGame']).toBeFalsy();
    });
});
