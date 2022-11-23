import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PopUpData } from '@app/interfaces/pop-up-data';

@Component({
    selector: 'app-pop-dialog-endgame',
    templateUrl: './pop-dialog-endgame.component.html',
    styleUrls: ['./pop-dialog-endgame.component.scss'],
})
export class PopDialogEndgameComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: PopUpData) {}
}
