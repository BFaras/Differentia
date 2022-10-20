import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import { GAME_MESSAGE_SENDER_NAME } from '@common/const';
import { Observable, Subscriber } from 'rxjs';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatMessagesService {
    public messagesObservable: Observable<ChatMessage>;

    //To test
    constructor(private socketService: SocketClientService) {
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    //To test
    private configureSocket(observer: Subscriber<ChatMessage>) {
        this.socketService.on('Valid click', (response: number[]) => {
            observer.next({ senderName: GAME_MESSAGE_SENDER_NAME, message: 'You found a difference!' });
        });
    }
}
