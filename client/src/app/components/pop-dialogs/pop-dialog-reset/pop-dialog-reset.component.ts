import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
    DEFAULT_INITIAL_TIME,
    DEFAULT_PENALTY_TIME,
    DEFAULT_SAVED_TIME,
    EMPTY_MESSAGE,
    RESET_INFO_CONSTANTS,
    RESET_INFO_GAME_LIST,
    RESET_INFO_RECORDS_TIME,
} from '@app/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeConstants } from '@common/time-constants';

@Component({
    selector: 'app-pop-dialog-reset',
    templateUrl: './pop-dialog-reset.component.html',
    styleUrls: ['./pop-dialog-reset.component.scss'],
})
export class PopDialogResetComponent implements OnInit {
    recordsTime = EMPTY_MESSAGE;
    gameConstants = EMPTY_MESSAGE;
    gameFormList = EMPTY_MESSAGE;
    resetTimeConstants = false;
    resetRecordsTimeBoard = false;
    resetGameFormList = false;
    isLastChance = false;
    isValidChoice = false;
    timeConstants: TimeConstants = {
        initialTime: DEFAULT_INITIAL_TIME,
        penaltyTime: DEFAULT_PENALTY_TIME,
        savedTime: DEFAULT_SAVED_TIME,
    };

    constructor(public dialogRef: MatDialogRef<PopDialogResetComponent>, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.getInfoToReset();
    }

    getInfoToReset() {
        this.recordsTime = this.resetRecordsTimeBoard ? RESET_INFO_RECORDS_TIME : EMPTY_MESSAGE;
        this.gameConstants = this.resetTimeConstants ? RESET_INFO_CONSTANTS : EMPTY_MESSAGE;
        this.gameFormList = this.resetGameFormList ? RESET_INFO_GAME_LIST : EMPTY_MESSAGE;
    }

    validateChoice() {
        if (this.resetTimeConstants || this.resetRecordsTimeBoard || this.resetGameFormList) {
            this.isLastChance = true;
            this.isValidChoice = true;
        }
    }

    resetData() {
        if (this.resetRecordsTimeBoard) console.log('RESET');
        if (this.resetTimeConstants) this.socketService.send('Set time constants', this.timeConstants);
        if (this.resetGameFormList) {
            this.socketService.send('Reset game list');
            this.socketService.on('Ready to reset game list', (value) => {
                this.socketService.send('Reload game selection page', value);
            });
        }
        this.dialogRef.close();
    }

    modifyChoice() {
        this.isValidChoice = false;
        this.isLastChance = false;
    }
}
