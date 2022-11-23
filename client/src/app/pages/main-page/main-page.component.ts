import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'Jeu de Difference';
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
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                classicFlag: false,
            },
        });
    }

    private configureBaseSocketFeatures() {
        this.socketService.on('connect', () => {
            console.log(`Connexion par WebSocket sur le socket ${this.socketId}`);
        });
    }
}
