import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopDialogWaitingForPlayerComponent } from
'@app/components/pop-dialogs/pop-dialog-waiting-for-player/pop-dialog-waiting-for-player.component';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { PopDialogLimitedTimeModeComponent } from '@app/components/pop-dialogs/pop-dialog-limited-time-mode/pop-dialog-limited-time-mode.component';
import { CLASSIC_MODE, LIMITED_TIME_MODE } from '@common/const';

@Component({
    selector: 'app-pop-dialog-username',
    templateUrl: './pop-dialog-username.component.html',
    styleUrls: ['./pop-dialog-username.component.scss'],
})
export class PopDialogUsernameComponent implements OnInit {
    @ViewChild('userName') username: ElementRef;
    disabledButton: boolean = true;
    usernameNotValid: boolean = false;

    constructor(
        private socketService: SocketClientService,
        @Inject(MAT_DIALOG_DATA) public gameInfo: any,
        public startUpGameService: StartUpGameService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<PopDialogUsernameComponent>,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.socketService.connect();
        this.configureUsernamePopUpSocketFeatures();
    }

    ngOnDestroy(): void {
        // this.socketService.off('username valid');
        // this.socketService.sendBuffer = [];
        // this.socketService.off('username valid');
        this.socketService.reset();
    }

    inputChanged(): void {
        if (this.username.nativeElement.value) this.disabledButton = false;
        else this.disabledButton = true;
    }

    private startWaitingLine(): void {
        this.startUpGameService.startUpWaitingLine(this.gameInfo);
    }

    private openClassicDialog(): void {
        this.dialog.open(PopDialogWaitingForPlayerComponent, {
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                nameGame: this.gameInfo.nameGame,
                joinFlag: this.gameInfo.joinFlag,
                createFlag: this.gameInfo.createFlag,
                username: this.username.nativeElement.value,
            },
        });
    }

    private openLimitedTimeDialog(): void {
        this.dialog.open(PopDialogLimitedTimeModeComponent, {
            height: '400px',
            width: '600px',
            disableClose: true,
        });
    }

    private closeDialog(): void {
        this.dialogRef.close();
    }

    private configureUsernamePopUpSocketFeatures(): void {
        this.socketService.on('username valid', () => {
            this.startWaitingLine();
            this.socketService.send('gameMode is', this.gameInfo.classicFlag);
            this.closeDialog();
        });

        this.socketService.on('username not valid', () => {
            this.usernameNotValid = true;
        });

        this.socketService.on(`${CLASSIC_MODE}`, () => {
            if (this.gameInfo.multiFlag) {
                this.openClassicDialog();
            } else {
                this.router.navigate(['/game']);
            }
        });

        this.socketService.on(`open the ${LIMITED_TIME_MODE} pop-dialog`, () => {
            this.openLimitedTimeDialog();
        });
    }
}
