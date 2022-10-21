import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';

@Component({
    selector: 'app-pop-dialog-username',
    templateUrl: './pop-dialog-username.component.html',
    styleUrls: ['./pop-dialog-username.component.scss'],
})
export class PopDialogUsernameComponent implements OnInit {
    @ViewChild('username') username: ElementRef;
    disabledButton: boolean = true;

    constructor(private socketService: SocketClientService, 
        @Inject(MAT_DIALOG_DATA) private gameInfo: any,
        private startUpGameService: StartUpGameService
        ) {}

    ngOnInit(): void {
        this.socketService.connect();
    }

    public gamePage(): void {
        this.startUpGameService.isItMultiplayer(this.gameInfo);
        
        this.startUpGameService.sendUsername(this.username.nativeElement.value);
    }

    public inputChanged(): void{
        if(this.username.nativeElement.value) this.disabledButton = false;
        else this.disabledButton = true;
    }

}
