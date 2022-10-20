import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ChatMessage } from '@common/chat-message';
import { Subscription } from 'rxjs';

import { Socket } from 'socket.io-client';
import { ChatMessagesService } from './chat-messages.service';
import { SocketClientService } from './socket-client.service';

describe('ChatMessagesService', () => {
  const emptySubcriberCallbackTest = (message : ChatMessage) => {};
  const defaultMessageTest : ChatMessage = {senderName : "Player1", message : "Hello"};
  let chatMessagesService: ChatMessagesService;
  let socketService : SocketClientService;
  let observer : Subscription;
  let socketTestHelper : SocketTestHelper;

  beforeAll(() => {
    TestBed.configureTestingModule({});
    socketService = TestBed.inject(SocketClientService);
    chatMessagesService = TestBed.inject(ChatMessagesService);
    socketTestHelper = new SocketTestHelper();
    socketService.socket = (socketTestHelper as unknown) as Socket;
  });

  it('should create an observable which we can subscribe to on construction', () => {
    observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
    expect(observer).toBeTruthy;
  });

  it('should call create an observable and when we subscribe the callback will be called', () => {
    observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
    expect(emptySubcriberCallbackTest).toHaveBeenCalled;
  });

  it('should call the callback when someone is subscribed to the observable and a Valid click event is sent', async () => {
    observer = chatMessagesService.messagesObservable.subscribe(emptySubcriberCallbackTest);
    socketTestHelper.peerSideEmit('Valid click', defaultMessageTest);
    await setTimeout(()=>{
      expect(emptySubcriberCallbackTest).toHaveBeenCalled;
    })
  });
});
