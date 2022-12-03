import { Component,  Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CLASSIC_FLAG, DISABLE_BUTTON, DISABLE_CLOSE, STANDARD_POP_UP_HEIGHT, STANDARD_POP_UP_WIDTH, USERNAME_VALID } from '@app/client-consts';
import { PopDialogLimitedTimeModeComponent } from '@app/components/pop-dialogs/pop-dialog-limited-time-mode/pop-dialog-limited-time-mode.component';
import { PopDialogWaitingForPlayerComponent } from '@app/components/pop-dialogs/pop-dialog-waiting-for-player/pop-dialog-waiting-for-player.component';
import { PopUpData } from '@app/interfaces/pop-up-data';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { CLASSIC_MODE, LIMITED_TIME_MODE } from '@common/const';

@Component({
    selector: 'app-pop-dialog-username',
    templateUrl: './pop-dialog-username.component.html',
    styleUrls: ['./pop-dialog-username.component.scss'],
})
export class PopDialogUsernameComponent implements OnInit {
    username: string;
    disabledButton: boolean = DISABLE_BUTTON;
    usernameNotValid: boolean = !USERNAME_VALID;

    constructor(
        private socketService: SocketClientService,
        @Inject(MAT_DIALOG_DATA) public gameInfo: PopUpData,
        public startUpGameService: StartUpGameService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<PopDialogUsernameComponent>,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.socketService.connect();
        this.configureUsernamePopUpSocketFeatures();
    }
    private startWaitingLine(): void {
        this.startUpGameService.startUpWaitingLine(this.gameInfo);
    }

    private openClassicDialog(): void {
        this.dialog.open(PopDialogWaitingForPlayerComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: {
                nameGame: this.gameInfo.nameGame,
                joinFlag: this.gameInfo.joinFlag,
                createFlag: this.gameInfo.createFlag,
                username: this.username,
                classicFlag: CLASSIC_FLAG,
            },
        });
    }

    private openLimitedTimeDialog(): void {
        this.dialog.open(PopDialogLimitedTimeModeComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: {
                classicFlag: !CLASSIC_FLAG,
                username: this.username,
            },
        });
    }

    private closeDialog(): void {
        this.dialogRef.close();
    }

    private closeGameDialog(value: string) {
        if (this.gameInfo.nameGame === value) {
            this.socketService.send('refresh games after closing popDialog', this.socketService.socket.id);
            this.dialog.closeAll();
        }
    }

    private configureUsernamePopUpSocketFeatures(): void {
        this.socketService.on('username valid', () => {
            this.socketService.off('username valid');
            this.socketService.send('gameMode is', this.gameInfo.classicFlag);
            this.closeDialog();
        });

        this.socketService.on('username not valid', () => {
            this.socketService.off('username not valid');
            this.usernameNotValid = !USERNAME_VALID;
        });

        this.socketService.on(`${CLASSIC_MODE}`, () => {
            this.startWaitingLine();
            this.socketService.off(`${CLASSIC_MODE}`);
            if (this.gameInfo.multiFlag) {
                this.openClassicDialog();
            } else {
                this.router.navigate(['/game']);
            }
        });

        this.socketService.on(`open the ${LIMITED_TIME_MODE} pop-dialog`, () => {
            this.socketService.off(`open the ${LIMITED_TIME_MODE} pop-dialog`);
            this.openLimitedTimeDialog();
        });

        this.socketService.on('close popDialogUsername', (value: string | string[]) => {
            if (Array.isArray(value)) {
                for (let gameName of value) {
                    this.closeGameDialog(gameName);
                }
            } else {
                this.closeGameDialog(value);
            }
        });
    }
}
