import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatMessage } from '@common/chat-message';
import { DEFAULT_USERNAME, MESSAGE_DIFFERENCE_FOUND_SOLO, MESSAGE_ERROR_DIFFERENCE_SOLO, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Subscription } from 'rxjs';

import { Socket } from 'socket.io-client';
import { ChatMessagesService } from './chat-messages.service';
import { SocketClientService } from './socket-client.service';

describe('ChatMessagesService', () => {
    const emptySubcriberCallbackTest = (message: ChatMessage) => {};
    const putResponseInVariableCallback = (message: ChatMessage) => {
        messageReceivedFromObservable = message;
    };
    const notValidClickInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: NO_DIFFERENCE_FOUND_ARRAY,
        isValidDifference: false,
        playerName: DEFAULT_USERNAME,
    };
    const differencesFoundInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: [0],
        isValidDifference: true,
        playerName: DEFAULT_USERNAME,
    };
    let chatMessagesService: ChatMessagesService;
    let socketService: SocketClientService;
    let observer: Subscription;
    let socketTestHelper: SocketTestHelper;
    let messageReceivedFromObservable: ChatMessage;

    beforeAll(() => {
        TestBed.configureTestingModule({});
        socketService = TestBed.inject(SocketClientService);
        chatMessagesService = TestBed.inject(ChatMessagesService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should create an observable which we can subscribe to on construction', () => {
        observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
        expect(observer).toBeTruthy;
    });

    it('should call create an observable and when we subscribe the callback will be called', () => {
        observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
        expect(emptySubcriberCallbackTest).toHaveBeenCalled;
    });

    it('should send the error message when a Valid click event is sent and there is no difference found', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        socketTestHelper.peerSideEmit('Valid click', notValidClickInfo);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message).toEqual(MESSAGE_ERROR_DIFFERENCE_SOLO);
        });
    });

    it('should send the error message when a Valid click event is sent and there is no difference found', async () => {
        observer = chatMessagesService.messagesObservable.subscribe(putResponseInVariableCallback);
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        await setTimeout(() => {
            expect(messageReceivedFromObservable.message).toEqual(MESSAGE_DIFFERENCE_FOUND_SOLO);
        });
    });
});
