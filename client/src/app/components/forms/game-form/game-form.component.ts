import { Component, Input, OnInit } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';

@Component({
    selector: 'app-game-form',
    templateUrl: './game-form.component.html',
    styleUrls: ['./game-form.component.scss'],
})
export class GameFormComponent implements OnInit {
    @Input() gameForm: GameFormDescription;

    constructor() {}

    ngOnInit(): void {

    }
}
