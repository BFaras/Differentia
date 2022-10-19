import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatMessagesService } from '@app/services/chat-messages.service';
import { ChatMessage } from '@common/chat-message';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat-section',
    templateUrl: './chat-section.component.html',
    styleUrls: ['./chat-section.component.scss'],
})
export class ChatSectionComponent implements OnInit, OnDestroy {
    public messagesSent: ChatMessage[];
    private chatMessagesSubscription: Subscription;

    constructor(private chatMessagesService: ChatMessagesService) {
        this.messagesSent = [
            { senderName: 'Raphael', message: 'Hello you' },
            { senderName: 'Someone101', message: 'Hello you too' },
        ];
    }

    ngOnInit(): void {
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
}
