import { Injectable } from '@angular/core';
import {
    ABANDON_MESSAGE,
    GAME_MESSAGE_SENDER_NAME,
    MESSAGE_CLUE,
    MESSAGE_DIFFERENCE_FOUND_MULTI,
    MESSAGE_DIFFERENCE_FOUND_SOLO,
    MESSAGE_ERROR_DIFFERENCE_MULTI,
    MESSAGE_ERROR_DIFFERENCE_SOLO,
    MESSAGE_RECORD_MULTI,
    MESSAGE_RECORD_PART_ONE,
    MESSAGE_RECORD_PART_TWO,
    MESSAGE_RECORD_SOLO,
    TWO_DIGIT_TIME_VALUE,
} from '@app/const/client-consts';
import { ChatMessage } from '@common/chat-message';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { RecordTimeInformations } from '@common/record-time-infos';
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
    isWriting: boolean = false;

    constructor(private socketService: SocketClientService) {
        this.date = new Date();
        this.isMultiplayerGame = false;
        this.messagesObservable = new Observable((observer: Subscriber<ChatMessage>) => {
            this.configureSocket(observer);
        });
    }

    sendMessage(senderName: string, message: string) {
        if (message.trim() != '') {
            this.socketService.send('playerMessage', this.generateChatMessage(senderName, message));
        }
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

        this.socketService.on('New record time', (recordTimeInfos: RecordTimeInformations) => {
            this.sendNewRecordMessage(observer, recordTimeInfos);
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
                this.sendAbandonMessage(observer);
            }
        });

        this.socketService.on('Other player abandonned LM', () => {
            this.sendAbandonMessage(observer);
            this.isMultiplayerGame = false;
        });

        this.socketService.on('Clue with quadrant of difference', () => {
            observer.next(this.generateChatMessageFromGame(MESSAGE_CLUE));
        });

        this.socketService.on('Clue with difference pixels', () => {
            observer.next(this.generateChatMessageFromGame(MESSAGE_CLUE));
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

    private sendAbandonMessage(observer: Subscriber<ChatMessage>) {
        observer.next(this.generateChatMessageFromGame(this.adversaryUsername + ABANDON_MESSAGE));
    }

    private generateRecordMessageType(recordTimeInfos: RecordTimeInformations): string {
        const newRecordChatMessage =
            recordTimeInfos.playerName +
            MESSAGE_RECORD_PART_ONE +
            recordTimeInfos.playerRanking +
            MESSAGE_RECORD_PART_TWO +
            recordTimeInfos.gameName +
            (recordTimeInfos.isMultiplayer ? MESSAGE_RECORD_MULTI : MESSAGE_RECORD_SOLO);

        return newRecordChatMessage;
    }

    private sendNewRecordMessage(observer: Subscriber<ChatMessage>, recordTimeInfos: RecordTimeInformations) {
        const newRecordChatMessage: string = this.generateRecordMessageType(recordTimeInfos);
        observer.next(this.generateChatMessageFromGame(newRecordChatMessage));
    }
}
