import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DEFAULT_INITIAL_TIME, DEFAULT_PENALTY_TIME, DEFAULT_SAVED_TIME } from '@app/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeConstants } from '@common/time-constants';

@Component({
    selector: 'app-pop-dialog-reset',
    templateUrl: './pop-dialog-reset.component.html',
    styleUrls: ['./pop-dialog-reset.component.scss'],
})
export class PopDialogResetComponent implements OnInit {
    recordsTime = '';
    gameConstants = '';
    resetTimeConstants = false;
    resetRecordsTimeBoard = false;
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
        this.recordsTime = this.resetRecordsTimeBoard ? 'Table des meilleurs temps de jeu' : '';
        this.gameConstants = this.resetTimeConstants ? 'Constantes de jeu' : '';
    }

    validateChoice() {
        if (this.resetTimeConstants || this.resetRecordsTimeBoard) {
            this.isLastChance = true;
            this.isValidChoice = true;
        }
    }

    resetData() {
        if (this.recordsTime) console.log('RESET');
        if (this.gameConstants) this.socketService.send('Set time constants', this.timeConstants);
        this.dialogRef.close();
    }

    modifyChoice() {
        this.isValidChoice = false;
        this.isLastChance = false;
    }
}
