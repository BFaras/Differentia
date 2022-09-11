import { Component, OnInit } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { FormService } from '@app/services/form.service';

@Component({
    selector: 'app-list-game-form',
    templateUrl: './list-game-form.component.html',
    styleUrls: ['./list-game-form.component.scss'],
})
export class ListGameFormComponent implements OnInit {
    gameFormList: GameFormDescription[];
    firstElementIndex: number = 0;
    fourthElementIndex: number = 3;

    constructor(private formService: FormService) {}

    ngOnInit(): void {
        this.gameFormList = this.formService.gameForms;
    }

    nextFourGameForms() {
        //const 4
        this.firstElementIndex += 4;
        this.fourthElementIndex += 4;
    }

    previousFourGameForms() {
        //const 4
        this.firstElementIndex -= 4;
        this.fourthElementIndex -= 4;
    }
}
