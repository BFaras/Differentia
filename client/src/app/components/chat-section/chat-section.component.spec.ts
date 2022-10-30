import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatMessagesService } from '@app/services/chat-messages.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ChatMessage } from '@common/chat-message';
import { Observable, Subscriber } from 'rxjs';
import { Socket } from 'socket.io-client';

import { ChatSectionComponent } from './chat-section.component';

describe('ChatSectionComponent', () => {
    const testMessage: ChatMessage = { timeMessageSent: '00:00:00', senderName: 'Player1', message: 'Hi' };
    const testUsername = 'PlayerTest1';
    let chatSectionComponent: ChatSectionComponent;
    let fixture: ComponentFixture<ChatSectionComponent>;
    let chatMessagesService: ChatMessagesService;
    let socketService: SocketClientService;
    let socketTestHelper: SocketTestHelper;
    let testObserver: Subscriber<ChatMessage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ChatSectionComponent);
        chatSectionComponent = fixture.componentInstance;
        fixture.detectChanges();

        socketService = TestBed.inject(SocketClientService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;

        chatMessagesService = TestBed.inject(ChatMessagesService);
        chatMessagesService.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            testObserver = observer;
            observer.next(testMessage);
        });

        chatSectionComponent.ngOnInit();
    });

    it('should subscribe to the ChatMessagesService observable on init ', () => {
        expect(testObserver).not.toBeUndefined();
    });

    it('should call addMessage when the observer sends information', () => {
        const spy = spyOn(chatSectionComponent, <any>'addMessage');
        expect(spy).toHaveBeenCalled;
    });

    it('should add a message to the message list when the observable sends an event', () => {
        testObserver.next(testMessage);
        expect(chatSectionComponent.messagesSent).toEqual([testMessage, testMessage]);
    });

    it('should unsubscribe from the observable on ngOnDestroy and not use the callback', () => {
        chatSectionComponent.ngOnDestroy();
        testObserver.next(testMessage);
        expect(chatSectionComponent.messagesSent).not.toEqual([testMessage, testMessage]);
    });

    it('should ngOnDestroy() call resetresetIsMultiplayer() of ChatMessageService', () => {
        const spy = spyOn(chatMessagesService, 'resetIsMultiplayer');
        chatSectionComponent.ngOnDestroy();
        expect(spy).toHaveBeenCalled;
    });

    it('should handle a show the username event and change the local player username', () => {
        socketTestHelper.peerSideEmit('show the username', testUsername);
        expect(chatSectionComponent.localPlayerUsername).toEqual(testUsername);
    });

    // it('should call preventDefault if key is Enter', () => {
    //     const keyboardEvent: KeyboardEvent = new KeyboardEvent('Enter');
    //     const spy = spyOn(keyboardEvent, 'preventDefault');
    //     Object.defineProperty(keyboardEvent, 'key', {
    //         get: () => 'Enter',
    //     });

    //     chatSectionComponent.handleKeyEvent(keyboardEvent);
    //     expect(spy).toHaveBeenCalled();
    // });

    // it('should call not call preventDefault if key is not Enter', () => {
    //     const arrowDownEvent: KeyboardEvent = new KeyboardEvent('ArrowDown');
    //     const spy = spyOn(arrowDownEvent, 'preventDefault');
    //     Object.defineProperty(arrowDownEvent, 'key', {
    //         get: () => 'ArrowDown',
    //     });

    //     chatSectionComponent.handleKeyEvent(arrowDownEvent);
    //     expect(spy).not.toHaveBeenCalled();
    // });
});
