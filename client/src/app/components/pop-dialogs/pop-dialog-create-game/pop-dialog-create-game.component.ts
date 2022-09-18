import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    nameOfGame: string;
    constructor() {}

    ngOnInit(): void {}
}
