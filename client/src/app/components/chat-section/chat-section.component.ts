import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatMessagesService } from '@app/services/chat-messages.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ChatMessage } from '@common/chat-message';
import { DEFAULT_USERNAME, GAME_MESSAGE_SENDER_NAME } from '@common/const';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat-section',
    templateUrl: './chat-section.component.html',
    styleUrls: ['./chat-section.component.scss'],
})
export class ChatSectionComponent implements OnInit, OnDestroy {
    public messagesSent: ChatMessage[];
    public localPlayerUsername: string = DEFAULT_USERNAME;
    public readonly game_message_sender_name = GAME_MESSAGE_SENDER_NAME;
    private chatMessagesSubscription: Subscription;

    constructor(private chatMessagesService: ChatMessagesService, private socketService: SocketClientService) {
        this.messagesSent = [];
    }

    ngOnInit(): void {
        this.socketService.connect();
        this.configureSocket();
        this.chatMessagesSubscription = this.chatMessagesService.messagesObservable.subscribe({
            next: (message: ChatMessage) => {
                this.addMessage(message);
            },
        });
    }

    ngOnDestroy(): void {
        this.chatMessagesSubscription.unsubscribe();
    }

    private addMessage(messageToAdd: ChatMessage) {
        this.messagesSent.push(messageToAdd);
    }

    private configureSocket() {
        this.socketService.on('show the username', (username: string) => {
            this.localPlayerUsername = username;
        });
    }
}
