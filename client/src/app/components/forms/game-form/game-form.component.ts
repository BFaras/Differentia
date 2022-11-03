import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameFormDescription } from '@app/classes/game-form-description';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import { SocketClientService } from '@app/services/socket-client.service';
// import { ADMIN_GAME_FORMS_BUTTON, SELECTION_GAME_FORMS_BUTTON, MULTIPLAYER_MODE } from '@app/client-consts';
// Comment je fait pour avoir accès à ces constante dans le fichier html

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() buttonPage: string;
    @Output() newItemEvent = new EventEmitter<string>();
    //mettre les 3 prochaines valeurs dans un fichier constantes
    adminGameFormsButton = ['Supprimer', 'Réinitialiser'];
    selectionGameFormsButton = ['Créer', 'Jouer', 'Joindre'];
    multiplayerFlag: boolean = true;
    // ---------------------------------------------------------
    isPlayerWaiting: boolean = false;
    joinFLag: boolean = false;
    createFlag: boolean = false;
    constructor(private dialog: MatDialog, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.configureGameFormSocketFeatures();
        this.socketService.send('is there someone waiting', this.gameForm.gameName);
    }

    ngOnAfterInit(): void {}

    public openDialog(multiplayerFlag: boolean): void {
        this.dialog.open(PopDialogUsernameComponent, {
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                nameGame: this.gameForm.gameName,
                multiFlag: multiplayerFlag,
                joinFlag: this.joinFLag,
                createFlag: this.createFlag,
                isPlayerWaiting: this.isPlayerWaiting,
            },
        });
    }

    deleteGameForm(value: string) {
        this.newItemEvent.emit(value);
    }
    public setJoinFlag(): void {
        this.joinFLag = true;
        this.createFlag = false;
    }

    public setCreateFlag(): void {
        this.createFlag = true;
        this.joinFLag = false;
    }

    public resetFlags(): void {
        this.createFlag = false;
        this.joinFLag = false;
    }

    private configureGameFormSocketFeatures(): void {
        this.socketService.connect();
        if (this.gameForm.gameName) {
            this.socketService.on(`${this.gameForm.gameName} let me tell you if someone is waiting`, (response: boolean) => {
                this.isPlayerWaiting = response;
            });

            this.socketService.on(`${this.gameForm.gameName} nobody is waiting no more`, () => {
                this.isPlayerWaiting = false;
            });

            this.socketService.on('reconnect', () => {
                this.ngOnInit();
            });
        }
    }
}
