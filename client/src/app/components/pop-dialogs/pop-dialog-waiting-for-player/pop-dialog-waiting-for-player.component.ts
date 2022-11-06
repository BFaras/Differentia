import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopDialogHostRefusedComponent } from '@app/components/pop-dialogs/pop-dialog-host-refused/pop-dialog-host-refused.component';
import { CreateGameService } from '@app/services/create-game.service';
import { JoinGameService } from '@app/services/join-game.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';

@Component({
    selector: 'app-pop-dialog-waiting-for-player',
    templateUrl: './pop-dialog-waiting-for-player.component.html',
    styleUrls: ['./pop-dialog-waiting-for-player.component.scss'],
})
export class PopDialogWaitingForPlayerComponent implements OnInit {
    isSomeoneJoining: boolean = false;
    playerTryingToJoin: string = '';
    isHostPresent: boolean = true;
    constructor(
        private socketService: SocketClientService,
        public createGameService: CreateGameService,
        public joinGameService: JoinGameService,
        public startUpGameService: StartUpGameService,
        private dialogRef: MatDialogRef<PopDialogWaitingForPlayerComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public gameInfo: any,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.socketService.connect();
        this.configureWaitingPopUpSocketFeatures();
        this.socketService.send(`Is the host still there`, this.gameInfo.nameGame);
    }
    private openRefusedDialog(didHostChoseAnother: boolean): void {
        this.dialog.open(PopDialogHostRefusedComponent, {
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                didHostChoseAnotherFlag: didHostChoseAnother,
            },
        });
    }
    private configureWaitingPopUpSocketFeatures(): void {
        this.socketService.on(`${this.gameInfo.nameGame} someone is trying to join`, (username: string) => {
            this.isSomeoneJoining = true;
            this.playerTryingToJoin = username;
        });
        this.socketService.on(`${this.gameInfo.nameGame} the player trying to join left`, () => {
            this.isSomeoneJoining = false;
            this.playerTryingToJoin = '';
        });
        this.socketService.on(`${this.gameInfo.nameGame} response on host presence`, (response: boolean) => {
            this.isHostPresent = response;
        });
        this.socketService.on(`${this.gameInfo.nameGame} you have been declined`, (didHostChoseAnother: boolean) => {
            this.dialogRef.close();
            this.openRefusedDialog(didHostChoseAnother);
        });
        this.socketService.on(`${this.gameInfo.nameGame} you have been accepted`, () => {
            this.dialogRef.close();
            this.router.navigate(['/game']);
        });
        this.socketService.on('The adversary username is', (username: string) => {
            console.log(username);
        });
    }
}
