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
        jasmine.clock().install();
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

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should subscribe to the ChatMessagesService observable on init ', () => {
        expect(testObserver).not.toBeUndefined();
    });

    it('should call addMessage when the observer sends information', () => {
        const spy = spyOn(chatSectionComponent, <any>'addMessage');
        expect(spy).toHaveBeenCalled;
    });

    it('should call scrollToBottom when the observer sends information', () => {
        const scrollSpy = spyOn(chatSectionComponent, <any>'scrollToBottom');
        jasmine.clock().tick(2);
        expect(scrollSpy).toHaveBeenCalled;
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

    it('should ngOnDestroy() call resetIsMultiplayer() of ChatMessageService', () => {
        const spy = spyOn(chatMessagesService, 'resetIsMultiplayer');
        chatSectionComponent.ngOnDestroy();
        expect(spy).toHaveBeenCalled;
    });

    it('should handle a show the username event and change the local player username', () => {
        socketTestHelper.peerSideEmit('show the username', testUsername);
        expect(chatSectionComponent.localPlayerUsername).toEqual(testUsername);
    });

    it('should call onFocus and change the value of is writing when the user is in the chat', () => {
        chatMessagesService.isWriting = false;
        chatSectionComponent.onFocus();
        expect(chatMessagesService.isWriting).toBeTrue();
    });

    it('should call outFocus and change the value of is writing when the user leaves the chat', () => {
        chatMessagesService.isWriting = true;
        chatSectionComponent.outFocus();
        expect(chatMessagesService.isWriting).toBeFalse();
    });

    it('should handle Other player abandonned LM and change the value of isMultiplayerGame', () => {
        chatMessagesService['isMultiplayerGame'] = true;
        socketTestHelper.peerSideEmit('Other player abandonned LM');
        expect(chatMessagesService['isMultiplayerGame']).toBeTrue();
    });

    it('should change the multiplayer game to true', () => {
        const testAdversaryName = 'testName1234';
        socketTestHelper.peerSideEmit('The adversary username is', testAdversaryName);
        expect(chatSectionComponent.isMultiplayerGame).toBeTruthy();
    });

    it('should change the multiplayer game to false on a Other player abandonned LM is event', () => {
        socketTestHelper.peerSideEmit('Other player abandonned LM');
        expect(chatSectionComponent.isMultiplayerGame).toBeFalsy();
    });

    it('should sendMessage() of ChatSectionComponent call sendMessage() of ChatMessageService and clear the input', () => {
        const sendMessageSpy = spyOn(chatMessagesService, 'sendMessage');
        chatSectionComponent.playerMsg = { nativeElement: { value: 'Hi' } };
        chatSectionComponent.sendMessage();

        expect(sendMessageSpy).toHaveBeenCalled;
        expect(chatSectionComponent.playerMsg.nativeElement.value).toEqual('');
    });
});
