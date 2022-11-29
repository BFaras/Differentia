import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import {
    CLASSIC_FLAG,
    CREATE_FLAG,
    DISABLE_CLOSE,
    EMPTY_GAME_NAME,
    JOIN_FLAG,
    MULTI_FLAG,
    SOMEBODY_IS_WAITING,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
} from '@app/const/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Peux-tu trouver les différences ?';
    readonly buttonName: String[] = ['Mode classique', 'Temps limité', 'Administration'];

    constructor(private socketService: SocketClientService, private dialog: MatDialog) {}

    get socketId() {
        return this.socketService.socket.id ? this.socketService.socket.id : '';
    }

    ngOnInit(): void {
        this.socketService.disconnect();
        this.socketService.connect();
        this.configureBaseSocketFeatures();
    }

    openDialog(): void {
        this.dialog.open(PopDialogUsernameComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
            data: {
                nameGame: EMPTY_GAME_NAME,
                classicFlag: !CLASSIC_FLAG,
                multiFlag: !MULTI_FLAG,
                joinFlag: !JOIN_FLAG,
                createFlag: !CREATE_FLAG,
                isPlayerWaiting: !SOMEBODY_IS_WAITING,
            },
        });
    }

    private configureBaseSocketFeatures() {
        this.socketService.on('connect', () => {
            console.log(`Connexion par WebSocket sur le socket ${this.socketId}`);
        });
    }
}
