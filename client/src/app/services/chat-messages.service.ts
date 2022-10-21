import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import {
    GAME_MESSAGE_SENDER_NAME,
    MESSAGE_DIFFERENCE_FOUND_DEFAULT,
    MESSAGE_ERROR_DIFFERENCE_DEFAULT,
    NO_DIFFERENCE_FOUND_ARRAY,
} from '@common/const';
import { Observable, Subscriber } from 'rxjs';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatMessagesService {
    public messagesObservable: Observable<ChatMessage>;
    private date: Date;

    constructor(private socketService: SocketClientService) {
        this.date = new Date();
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    public getTimeInCorrectFormat(): string {
        return this.date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }

    private configureSocket(observer: Subscriber<ChatMessage>) {
        this.socketService.on('Valid click', (response: number[]) => {
            if (response === NO_DIFFERENCE_FOUND_ARRAY) {
                observer.next({
                    timeMessageSent: this.getTimeInCorrectFormat(),
                    senderName: GAME_MESSAGE_SENDER_NAME,
                    message: MESSAGE_ERROR_DIFFERENCE_DEFAULT,
                });
            } else {
                observer.next({
                    timeMessageSent: this.getTimeInCorrectFormat(),
                    senderName: GAME_MESSAGE_SENDER_NAME,
                    message: MESSAGE_DIFFERENCE_FOUND_DEFAULT,
                });
            }
        });
    }
}
