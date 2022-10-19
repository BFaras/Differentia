import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import { Observable, Subscriber } from 'rxjs';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatMessagesService {
    messagesObservable: Observable<ChatMessage>;

    constructor(private socketService: SocketClientService) {
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    private configureSocket(observer: Subscriber<ChatMessage>) {
        this.socketService.on('Valid click', (response: number[]) => {
            observer.next({ senderName: 'Game', message: 'You found a difference!' });
        });
    }
}
