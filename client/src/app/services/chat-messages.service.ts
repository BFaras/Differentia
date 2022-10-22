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
    //message: ChatMessage;
    displayMessage: () => void;

    constructor(private socketService: SocketClientService) {
        this.date = new Date();
      //  this.message.message = '';
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    displayBound(fn: () => void) {
        this.displayMessage = fn;
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
                    this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_DIFFERENCE_FOUND_MULTI + differenceInfos.playerName),
                );
            } else if (differenceInfos.isValidDifference && !this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_DIFFERENCE_FOUND_SOLO));
            } else if (!differenceInfos.isValidDifference && this.isMultiplayerGame) {
                observer.next(
                    this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_ERROR_DIFFERENCE_MULTI + differenceInfos.playerName),
                );
            } else if (!differenceInfos.isValidDifference && this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(this.getTimeInCorrectFormat(), MESSAGE_ERROR_DIFFERENCE_SOLO));
            }
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
