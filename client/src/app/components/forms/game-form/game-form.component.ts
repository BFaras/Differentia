import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameFormDescription } from '@app/classes/game-form-description';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import { SocketClientService } from '@app/services/socket-client.service';
// import { CreateGameService } from '@app/services/create-game.service';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() buttonPage: string;
    adminGameFormsButton = ['Supprimer', 'Réinitialiser'];
    selectionGameFormsButton = ['Créer', 'Jouer', 'Joindre'];
    isPlayerWaiting: boolean = false;
    constructor(private dialog: MatDialog,
        // private createGameService : CreateGameService,
        private socketService: SocketClientService
        ) {}
        
    ngOnInit(): void {
        this.socketService.connect();
        this.configureGameFormSocketFeatures();
        this.socketService.send('is there someone waiting', this.gameForm.gameName);
    }
    
    ngOnAfterInit() : void {
    }

    openDialog(multiplayerFlag: boolean) {
        this.dialog.open(PopDialogUsernameComponent, {
            height: '400px',
            width: '600px',
            data: {
                nameGame: this.gameForm.gameName,
                multiFlag: multiplayerFlag,
                isPlayerWaiting: this.isPlayerWaiting,
            },
        });
    }

    configureGameFormSocketFeatures(): void {
        this.socketService.on(`${this.gameForm.gameName} let me tell you if someone is waiting`, (response: boolean) => {
            this.isPlayerWaiting = response;
        });

        this.socketService.on(`${this.gameForm.gameName} someone is waiting`, () => {
            this.isPlayerWaiting = true;
        })

        this.socketService.on(`${this.gameForm.gameName} nobody is waiting no more`, () => {
            this.isPlayerWaiting = false;
        })
    }

}
