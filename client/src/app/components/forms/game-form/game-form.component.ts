import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameFormDescription } from '@app/classes/game-form-description';
import { ADMIN_GAME_FORMS_BUTTON, MULTIPLAYER_MODE, SELECTION_GAME_FORMS_BUTTON } from '@app/client-consts';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';
import { SocketClientService } from '@app/services/socket-client.service';
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
    adminGameFormsButton = ADMIN_GAME_FORMS_BUTTON;
    selectionGameFormsButton = SELECTION_GAME_FORMS_BUTTON;
    multiplayerFlag = MULTIPLAYER_MODE;
    // ---------------------------------------------------------
    isPlayerWaiting: boolean = false;
    joinFlag: boolean = false;
    createFlag: boolean = false;
    constructor(private dialog: MatDialog, private socketService: SocketClientService) {}

    ngOnInit(): void {
        this.configureGameFormSocketFeatures();
        this.socketService.send('is there someone waiting', this.gameForm.gameName);
    }

    openDialog(multiplayerFlag: boolean): void {
        this.dialog.open(PopDialogUsernameComponent, {
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                nameGame: this.gameForm.gameName,
                multiFlag: multiplayerFlag,
                joinFlag: this.joinFlag,
                createFlag: this.createFlag,
                isPlayerWaiting: this.isPlayerWaiting,
            },
        });
    }

    deleteGameForm(value: string) {
        this.newItemEvent.emit(value);
    }
    setJoinFlag(): void {
        this.joinFlag = true;
        this.createFlag = false;
    }

    setCreateFlag(): void {
        this.createFlag = true;
        this.joinFlag = false;
    }

    resetFlags(): void {
        this.createFlag = false;
        this.joinFlag = false;
    }

    private configureGameFormSocketFeatures(): void {
        this.socketService.connect();
        if (this.gameForm.gameName) {
            this.socketService.on(`${this.gameForm.gameName} let me tell you if someone is waiting`, (response: boolean) => {
                this.isPlayerWaiting = response;
            });

            this.socketService.on('reconnect', () => {
                this.ngOnInit();
            });
        }
    }
}
