import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';
import { DEFAULT_USERNAME } from '@common/const';

@Component({
    selector: 'app-pop-dialog-username',
    templateUrl: './pop-dialog-username.component.html',
    styleUrls: ['./pop-dialog-username.component.scss'],
})
export class PopDialogUsernameComponent implements OnInit {
    @ViewChild('username') username: ElementRef;

    constructor(private socketService: SocketClientService, @Inject(MAT_DIALOG_DATA) private gameInfo: any) {}

    ngOnInit(): void {
        this.socketService.connect();
    }

    gamePage() {
        this.socketService.send('game page', this.gameInfo.nameGame);
        let username = this.username.nativeElement.value;
        if (username == '') username = DEFAULT_USERNAME;
        this.socketService.send('username is', username);
    }
}
