import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';

import { Socket } from 'socket.io-client';
import { ChatMessagesService } from './chat-messages.service';
import { SocketClientService } from './socket-client.service';

describe('ChatMessagesService', () => {
  let chatMessageService: ChatMessagesService;
  let socketService : SocketClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    chatMessageService = TestBed.inject(ChatMessagesService);
    socketService = TestBed.inject(SocketClientService);
    socketService.socket = (new SocketTestHelper() as unknown) as Socket;
  });

  it('should be created', () => {
    expect(chatMessageService).toBeTruthy();
  });
});
