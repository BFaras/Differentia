import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import { GAME_MESSAGE_SENDER_NAME, MESSAGE_DIFFERENCE_FOUND_DEFAULT, MESSAGE_ERROR_DIFFERENCE_DEFAULT, TWO_DIGIT_TIME_VALUE } from '@common/const';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Observable, Subscriber } from 'rxjs';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatMessagesService {
    public messagesObservable: Observable<ChatMessage>;
    private isMultiplayerGame = false;
    private date: Date;

    constructor(private socketService: SocketClientService) {
        this.date = new Date();
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    public getTimeInCorrectFormat(): string {
        return this.date.toLocaleString('en-US', {
            hour: TWO_DIGIT_TIME_VALUE,
            minute: TWO_DIGIT_TIME_VALUE,
            second: TWO_DIGIT_TIME_VALUE,
            hour12: false,
        });
    }

    private configureSocket(observer: Subscriber<ChatMessage>) {
        this.socketService.on('Valid click', (differenceInfos: GameplayDifferenceInformations) => {
            if (differenceInfos.isValidDifference) {
                observer.next(this.generateChatMessage(this.getTimeInCorrectFormat(), GAME_MESSAGE_SENDER_NAME, MESSAGE_DIFFERENCE_FOUND_DEFAULT));
            } else {
                observer.next(this.generateChatMessage(this.getTimeInCorrectFormat(), GAME_MESSAGE_SENDER_NAME, MESSAGE_ERROR_DIFFERENCE_DEFAULT));
            }
        });
    }

    private generateChatMessage(timeMessageSent: string, senderName: string, message: string): ChatMessage {
        return {
            timeMessageSent: timeMessageSent,
            senderName: senderName,
            message: message,
        };
    }
}
