import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
// eslint-disable-next-line max-len
import { PopDialogWaitingForPlayerComponent } from '@app/components/pop-dialogs/pop-dialog-waiting-for-player/pop-dialog-waiting-for-player.component';
import { STANDARD_POP_UP_HEIGHT, STANDARD_POP_UP_WIDTH, CREATE_FLAG, JOIN_FLAG, DISABLE_CLOSE, EMPTY_GAME_NAME, CLASSIC_FLAG } from '@app/client-consts';

@Component({
    selector: 'app-pop-dialog-limited-time-mode',
    templateUrl: './pop-dialog-limited-time-mode.component.html',
    styleUrls: ['./pop-dialog-limited-time-mode.component.scss'],
})
export class PopDialogLimitedTimeModeComponent implements OnInit {
    constructor(
        private socketService: SocketClientService,
        public startUpGameService: StartUpGameService,
        @Inject(MAT_DIALOG_DATA) public gameInfo: any,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<PopDialogLimitedTimeModeComponent>,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.socketService.connect();
        this.configureLimitedTimePopUpSocketFeatures();
    }

    openWaitingDialog(): void {
        this.dialog.open(PopDialogWaitingForPlayerComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: {
                nameGame: EMPTY_GAME_NAME,
                joinFlag: !JOIN_FLAG,
                createFlag: !CREATE_FLAG,
                username: this.gameInfo.username,
                classicFlag: !CLASSIC_FLAG,
            },
        });
    }

    close(): void {
        this.dialogRef.close();
    }

    private configureLimitedTimePopUpSocketFeatures(): void {
        this.socketService.on('response on limited time waiting line', (res: boolean) => {
            this.socketService.off('response on limited time waiting line');
            if (res) {
                this.socketService.send('launch limited time mode multiplayer match');
                this.close();
                this.router.navigate(['/game']);
            } else {
                this.close();
                this.openWaitingDialog();
            }
        });
    }
}
