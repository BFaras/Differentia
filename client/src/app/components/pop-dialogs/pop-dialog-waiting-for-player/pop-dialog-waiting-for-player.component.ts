import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopDialogHostRefusedComponent } from '@app/components/pop-dialogs/pop-dialog-host-refused/pop-dialog-host-refused.component';
import { DISABLE_CLOSE, EMPTY_PLAYER_NAME, SOMEONE_IS_JOINING, STANDARD_POP_UP_HEIGHT, STANDARD_POP_UP_WIDTH } from '@app/const/client-consts';
import { PopUpData } from '@app/interfaces/pop-up-data';
import { CreateGameService } from '@app/services/create-game.service';
import { JoinGameService } from '@app/services/join-game.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { HOST_PRESENT } from '@common/const';

@Component({
    selector: 'app-pop-dialog-waiting-for-player',
    templateUrl: './pop-dialog-waiting-for-player.component.html',
    styleUrls: ['./pop-dialog-waiting-for-player.component.scss'],
})
export class PopDialogWaitingForPlayerComponent implements OnInit {
    isSomeoneJoining: boolean = !SOMEONE_IS_JOINING;
    playerTryingToJoin: string = EMPTY_PLAYER_NAME;
    isHostPresent: boolean = HOST_PRESENT;
    constructor(
        private socketService: SocketClientService,
        public createGameService: CreateGameService,
        public joinGameService: JoinGameService,
        public startUpGameService: StartUpGameService,
        private dialogRef: MatDialogRef<PopDialogWaitingForPlayerComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public gameInfo: PopUpData,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.socketService.connect();
        this.configureWaitingPopUpSocketFeatures();
        if (this.gameInfo.classicFlag) this.socketService.send('Is the host still there', this.gameInfo.nameGame);
    }

    close(): void {
        this.dialogRef.close();
    }

    private openRefusedDialog(didHostChoseAnother: boolean): void {
        this.dialog.open(PopDialogHostRefusedComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: {
                didHostChoseAnotherFlag: didHostChoseAnother,
            },
        });
    }

    private configureWaitingPopUpSocketFeatures(): void {
        this.socketService.on(`${this.gameInfo.nameGame} someone is trying to join`, (username: string) => {
            this.isSomeoneJoining = SOMEONE_IS_JOINING;
            this.playerTryingToJoin = username;
        });
        this.socketService.on(`${this.gameInfo.nameGame} the player trying to join left`, () => {
            this.isSomeoneJoining = !SOMEONE_IS_JOINING;
            this.playerTryingToJoin = '';
        });
        this.socketService.on(`${this.gameInfo.nameGame} response on host presence`, (response: boolean) => {
            this.isHostPresent = response;
        });
        this.socketService.on(`${this.gameInfo.nameGame} you have been declined`, (didHostChoseAnother: boolean) => {
            this.socketService.off(`${this.gameInfo.nameGame} you have been declined`);
            this.close();
            this.openRefusedDialog(didHostChoseAnother);
        });
        this.socketService.on(`${this.gameInfo.nameGame} you have been accepted`, () => {
            this.socketService.off(`${this.gameInfo.nameGame} you have been accepted`);
            this.close();
            this.router.navigate(['/game']);
        });

        this.socketService.on('response on limited time waiting line', (res: boolean) => {
            if (res) {
                this.socketService.off('response on limited time waiting line');
                this.close();
                this.router.navigate(['/game']);
            }
        });
    }
}
