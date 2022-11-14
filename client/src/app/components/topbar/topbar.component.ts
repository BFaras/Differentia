/* eslint-disable prettier/prettier */

import { Component, Input, OnInit } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { ClueInformations } from '@common/clue-informations';
import { CLUE_AMOUNT_DEFAULT } from '@common/const';

@Component({
    selector: 'app-topbar',
    templateUrl: './topbar.component.html',
    styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
    @Input() nbrDifferencesFound: number[];
    @Input() playerNames: string[];
    @Input() isMultiplayer: boolean;
    clueAmountLeft: number;

    constructor(public timeService: TimeService, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.clueAmountLeft = CLUE_AMOUNT_DEFAULT;
        this.configureTopBarSocket();
    }

    //To test Raph
    private configureTopBarSocket() {
        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {
            this.clueAmountLeft = clueInformations.clueAmountLeft - 1;
        });
        this.socketService.on('Clue with difference pixels', () => {
            this.clueAmountLeft = 0;
        });
    }
}
