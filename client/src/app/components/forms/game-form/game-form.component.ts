import { Component, Input } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { SocketClientService } from '@app/services/socket-client.service';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() buttonPage: string;
    adminGameFormsButton = ['Supprimer', 'Réinitialiser'];
    selectionGameFormsButton = ['Créer', 'Jouer'];
    constructor(private socketService: SocketClientService,
        private dialog: MatDialog) {}

    ngOnInit() {
        this.socketService.connect();
    }

    openDialog() {
        this.dialog.open(PopDialogUsernameComponent, {
            height: '400px',
            width: '600px',
            data: {
                nameGame: this.gameForm.gameName
            }
        });
    }

    // gamePage() {
    //     this.socketService.send('game page', this.gameForm.gameName);
    // }
}
