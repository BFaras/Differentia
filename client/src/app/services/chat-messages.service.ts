import { Injectable } from '@angular/core';
import { ChatMessage } from '@common/chat-message';
import {
    ABANDON_MESSAGE,
    GAME_MESSAGE_SENDER_NAME,
    MESSAGE_DIFFERENCE_FOUND_MULTI,
    MESSAGE_DIFFERENCE_FOUND_SOLO,
    MESSAGE_ERROR_DIFFERENCE_MULTI,
    MESSAGE_ERROR_DIFFERENCE_SOLO,
    MESSAGE_INDICE,
    TWO_DIGIT_TIME_VALUE,
} from '@app/client-consts';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Observable, Subscriber } from 'rxjs';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class ChatMessagesService {
    messagesObservable: Observable<ChatMessage>;
    private adversaryUsername: string;
    private isMultiplayerGame: boolean;
    private date: Date;

    constructor(private socketService: SocketClientService) {
        this.date = new Date();
        this.isMultiplayerGame = false;
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    sendMessage(senderName: string, message: string) {
        this.socketService.send('playerMessage', this.generateChatMessage(senderName, message));
    }

    resetIsMultiplayer() {
        this.isMultiplayerGame = false;
    }

    private getTimeInCorrectFormat(): string {
        this.date = new Date();
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
                observer.next(this.generateChatMessageFromGame(MESSAGE_DIFFERENCE_FOUND_MULTI + differenceInfos.playerUsername));
            } else if (differenceInfos.isValidDifference && !this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(MESSAGE_DIFFERENCE_FOUND_SOLO));
            } else if (!differenceInfos.isValidDifference && this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(MESSAGE_ERROR_DIFFERENCE_MULTI + differenceInfos.playerUsername));
            } else if (!differenceInfos.isValidDifference && !this.isMultiplayerGame) {
                observer.next(this.generateChatMessageFromGame(MESSAGE_ERROR_DIFFERENCE_SOLO));
            }
        });
        this.socketService.on('Send message to opponent', (message: ChatMessage) => {
            observer.next(message);
        });

        this.socketService.on('The adversary username is', (adversaryName: string) => {
            this.isMultiplayerGame = true;
            this.adversaryUsername = adversaryName;
        });

        this.socketService.on('End game', (endGameInfos: EndGameInformations) => {
            if (endGameInfos.isMultiplayer && endGameInfos.isAbandon) {
                observer.next(this.generateChatMessageFromGame(this.adversaryUsername + ABANDON_MESSAGE));
            }
        });

        //To test Raph
        this.socketService.on('Clue with quadrant of difference', (endGameInfos: EndGameInformations) => {
            observer.next(this.generateChatMessageFromGame(MESSAGE_INDICE));
        });

        //To test Raph
        this.socketService.on('Clue with difference pixels', (endGameInfos: EndGameInformations) => {
            observer.next(this.generateChatMessageFromGame(MESSAGE_INDICE));
        });
    }

    private generateChatMessageFromGame(message: string) {
        return this.generateChatMessage(GAME_MESSAGE_SENDER_NAME, message);
    }

    private generateChatMessage(senderName: string, message: string): ChatMessage {
        return {
            timeMessageSent: this.getTimeInCorrectFormat(),
            senderName,
            message,
        };
    }
}
