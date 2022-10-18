import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '@common/chat-message';

@Component({
    selector: 'app-chat-section',
    templateUrl: './chat-section.component.html',
    styleUrls: ['./chat-section.component.scss'],
})
export class ChatSectionComponent implements OnInit {
    public messagesSent: ChatMessage[];
    constructor() {
        this.messagesSent = [
            { senderName: 'Raphael', message: 'Hello you' },
            { senderName: 'Someone101', message: 'Hello you too' },
        ];
    }

    ngOnInit(): void {}
}
