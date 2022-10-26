import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatMessagesService } from '@app/services/chat-messages.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ChatMessage } from '@common/chat-message';
import { DEFAULT_USERNAME, GAME_MESSAGE_SENDER_NAME, CHAT_HEIGHT } from '@common/const';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat-section',
    templateUrl: './chat-section.component.html',
    styleUrls: ['./chat-section.component.scss'],
})
export class ChatSectionComponent implements OnInit, OnDestroy {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('playerMsg') playerMsg: ElementRef;

    message: string;
    public messagesSent: ChatMessage[];
    public localPlayerUsername: string = DEFAULT_USERNAME;
    public readonly gameMessageSenderName = GAME_MESSAGE_SENDER_NAME;
    private chatMessagesSubscription: Subscription;

    constructor(private chatMessagesService: ChatMessagesService, private socketService: SocketClientService) {
        this.messagesSent = [];
    }

    sendMessage(): void {
        this.chatMessagesService.sendMessage(this.localPlayerUsername,this.playerMsg.nativeElement.value);
        this.playerMsg.nativeElement.value = "";
    };

    ngOnInit(): void {
        this.socketService.connect();
        this.configureSocket();
        this.chatMessagesSubscription = this.chatMessagesService.messagesObservable.subscribe({
            next: (message: ChatMessage) => {
                this.addMessage(message);
            },
        });
        this.initializeChatHeight();
    }

    ngOnDestroy(): void {
        this.chatMessagesSubscription.unsubscribe();
    }

    /*handleKeyEvent(event: KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.sendMessage();
        }
    }*/

    initializeChatHeight(): void {
        const chatBox = document.getElementById('chat-container');
        if (chatBox) chatBox.style.height = CHAT_HEIGHT + 'vh';
    }

    scrollToBottom(): void {
        setTimeout(() => {
            // Timeout is used to update the scroll after the last element added
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }, 1);
    }

    private addMessage(messageToAdd: ChatMessage) {
        console.log(messageToAdd.timeMessageSent);
        this.messagesSent.push(messageToAdd);
    }

    private configureSocket() {
        this.socketService.on('show the username', (username: string) => {
            this.localPlayerUsername = username;
        });
    }
}
