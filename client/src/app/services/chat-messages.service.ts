import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import { GAME_MESSAGE_SENDER_NAME, NO_DIFFERENCE_FOUND_ARRAY } from '@common/const';
import { Observable, Subscriber } from 'rxjs';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatMessagesService {
    public messagesObservable: Observable<ChatMessage>;

    constructor(private socketService: SocketClientService) {
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    private configureSocket(observer: Subscriber<ChatMessage>) {
        this.socketService.on('Valid click', (response: number[]) => {
            if (response === NO_DIFFERENCE_FOUND_ARRAY) {
                observer.next({ senderName: GAME_MESSAGE_SENDER_NAME, message: 'Error, no difference found!' });
            } else {
                observer.next({ senderName: GAME_MESSAGE_SENDER_NAME, message: 'You found a difference!' });
            }
        });
    }
}
