/* eslint-disable prettier/prettier */

import { Component, Input, OnInit } from '@angular/core';
import { TimeService } from '@app/services/time.service';
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

    constructor(public timeService: TimeService) {}

    ngOnInit(): void {
        this.clueAmountLeft = CLUE_AMOUNT_DEFAULT;
    }
}
