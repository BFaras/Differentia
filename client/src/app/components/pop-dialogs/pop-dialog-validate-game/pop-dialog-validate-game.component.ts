import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogCreateGameComponent } from '../pop-dialog-create-game/pop-dialog-create-game.component';
@Component({
    selector: 'app-pop-dialog-validate-game',
    templateUrl: './pop-dialog-validate-game.component.html',
    styleUrls: ['./pop-dialog-validate-game.component.scss'],
})
export class PopDialogValidateGameComponent implements OnInit {
    constructor(private dialog: MatDialog) {}

    ngOnInit(): void {}

    onCreateCreateGame() {
        this.dialog.open(PopDialogCreateGameComponent, {
            height: '400px',
            width: '600px',
        });
    }
}
