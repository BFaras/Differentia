import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameFormDescription } from '@app/classes/game-form-description';
import { PopDialogUsernameComponent } from '@app/components/pop-dialogs/pop-dialog-username/pop-dialog-username.component';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent {
    @Input() gameForm: GameFormDescription;
    @Input() buttonPage: string;
    @Output() newItemEvent = new EventEmitter<string>();
    adminGameFormsButton = ['Supprimer', 'Réinitialiser'];
    selectionGameFormsButton = ['Créer', 'Jouer'];
    constructor(private dialog: MatDialog) {}

    openDialog() {
        this.dialog.open(PopDialogUsernameComponent, {
            height: '400px',
            width: '600px',
            data: {
                nameGame: this.gameForm.gameName,
            },
        });
    }

    deleteGameForm(value: string) {
        this.newItemEvent.emit(value);
    }
}
