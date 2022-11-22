/* eslint-disable prettier/prettier */

import { Component, Input, OnInit } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    @Input() nbrDifferencesFound: number[];
    @Input() playerNames: string[];
    @Input() gameMode: string;
    indexPlayerLeft: number = 0;

    constructor(public timeService: TimeService, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.configureTopBarSocketFeatures();
    }

    configureTopBarSocketFeatures(): void {
        this.socketService.on('Other player abandonned LM', (username: string) => {
           if (this.playerNames[0] === username) {
            this.playerNames[0] = '';
            this.indexPlayerLeft = 1;
           } else {
            this.playerNames[1] = '';     
           }
        });
    }
}
