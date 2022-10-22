import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { PopDialogWaitingForPlayerComponent } from '../pop-dialog-waiting-for-player/pop-dialog-waiting-for-player.component';

@Component({
    selector: 'app-pop-dialog-username',
    templateUrl: './pop-dialog-username.component.html',
    styleUrls: ['./pop-dialog-username.component.scss'],
})
export class PopDialogUsernameComponent implements OnInit {
    @ViewChild('username') username: ElementRef;
    disabledButton: boolean = true;

    constructor(private socketService: SocketClientService, 
        @Inject(MAT_DIALOG_DATA) public gameInfo: any,
        private startUpGameService: StartUpGameService,
        private dialog: MatDialog,
        ) {}

    ngOnInit(): void {
        this.socketService.connect();
        console.log("gameinfo: " + this.gameInfo);
        console.log("gameInfo.nameGame : " + this.gameInfo.nameGame);
        console.log("gameInfo.multiFlag : " + this.gameInfo.multiFlag);
        console.log("gameInfo.createFlag : " + this.gameInfo.createFlag);
        console.log("gameInfo.isPlayerWaiting : " + this.gameInfo.isPlayerWaiting);
        console.log("gameInfo.joinFlag : " + this.gameInfo.joinFlag);
    }

    public gamePage(): void {
        this.startUpGameService.startUpWaitingLine(this.gameInfo, this.username.nativeElement.value);
    }

    public inputChanged(): void {
        if(this.username.nativeElement.value) this.disabledButton = false;
        else this.disabledButton = true;
    }

    public openDialog(): void {
        this.gamePage();
        this.dialog.open(PopDialogWaitingForPlayerComponent, {
            height: '400px',
            width: '600px',
            data: {
                nameGame: this.gameInfo.nameGame,
                joinFlag: this.gameInfo.joinFlag,
                createFlag: this.gameInfo.createFlag,
                username: this.username.nativeElement.value,
            },
        });
    }
}
