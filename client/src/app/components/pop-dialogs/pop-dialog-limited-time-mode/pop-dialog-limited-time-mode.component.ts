import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { PopDialogWaitingForPlayerComponent } from '../pop-dialog-waiting-for-player/pop-dialog-waiting-for-player.component';

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
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                nameGame: '',
                joinFlag: false,
                createFlag: false,
                username: this.gameInfo.username,
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
                console.log('jvais send le lunahc limite timed multi');
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
