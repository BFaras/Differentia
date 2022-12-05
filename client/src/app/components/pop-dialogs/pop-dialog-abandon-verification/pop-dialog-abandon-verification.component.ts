import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpData } from '@app/interfaces/pop-up-data';
import { SocketClientService } from '@app/services/socket-client.service';
import { AbandonData } from '@common/abandon-data';

@Component({
    selector: 'app-pop-dialog-abandon-verification',
    templateUrl: './pop-dialog-abandon-verification.component.html',
    styleUrls: ['./pop-dialog-abandon-verification.component.scss'],
})
export class PopDialogAbandonVerificationComponent {
    constructor(private socketService: SocketClientService, @Inject(MAT_DIALOG_DATA) public gameInfo: PopUpData) {}
    abandonGame(): void {
        const abandonInfo: AbandonData = {
            gameMode: this.gameInfo.gameMode,
            isMultiplayerMatch: this.gameInfo.multiFlag,
        };
        this.socketService.send('kill the game', abandonInfo);
    }
}
