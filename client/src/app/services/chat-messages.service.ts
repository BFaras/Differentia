import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import {
    GAME_MESSAGE_SENDER_NAME,
    MESSAGE_DIFFERENCE_FOUND_MULTI,
    MESSAGE_DIFFERENCE_FOUND_SOLO,
    MESSAGE_ERROR_DIFFERENCE_MULTI,
    MESSAGE_ERROR_DIFFERENCE_SOLO,
    TWO_DIGIT_TIME_VALUE,
} from '@common/const';
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

    sendMessage(senderName: string, message: string) {
        this.socketService.send('playerMessage', this.generateChatMessage(this.getTimeInCorrectFormat(), senderName, message));
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
            if (differenceInfos.isValidDifference && this.isMultiplayerGame) {
                observer.next(
                    this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_DIFFERENCE_FOUND_MULTI + differenceInfos.socketId),
                );
            } else if (differenceInfos.isValidDifference && !this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_DIFFERENCE_FOUND_SOLO));
            } else if (!differenceInfos.isValidDifference && this.isMultiplayerGame) {
                observer.next(
                    this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_ERROR_DIFFERENCE_MULTI + differenceInfos.socketId),
                );
            } else if (!differenceInfos.isValidDifference && !this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_ERROR_DIFFERENCE_SOLO));
            }
        });
        this.socketService.on('Send message to opponent', (message: ChatMessage) => {
            observer.next(message);
            console.log(message);
        });
    }

    private generateChatMessageFromGame(timeMessageSent: string, message: string) {
        return this.generateChatMessage(timeMessageSent, GAME_MESSAGE_SENDER_NAME, message);
    }

    private generateChatMessage(timeMessageSent: string, senderName: string, message: string): ChatMessage {
        return {
            timeMessageSent: timeMessageSent,
            senderName: senderName,
            message: message,
        };
    }
}
