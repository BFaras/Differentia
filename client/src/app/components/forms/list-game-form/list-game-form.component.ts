import { Component, OnInit } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { FormService } from '@app/services/form.service';

//TO DO : Put the constant in the configuration folder
const MAX_NB_OF_FORMS_PER_PAGE: number = 4;

@Component({
    selector: 'app-list-game-form',
    templateUrl: './list-game-form.component.html',
    styleUrls: ['./list-game-form.component.scss'],
})
export class ListGameFormComponent implements OnInit {
    firstElementIndex: number = 0;
    lastElementIndex: number = 3;
    currentPageGameFormList: GameFormDescription[];

    constructor(public formService: FormService) {}

    ngOnInit(): void {
        if (this.formService.gameForms.length < MAX_NB_OF_FORMS_PER_PAGE) {
            this.lastElementIndex = this.formService.gameForms.length - 1;
        }

        this.addCurrentPageGameForms();
    }

    nextPageGameForms() {
        //const 4
        if (this.firstElementIndex + MAX_NB_OF_FORMS_PER_PAGE < this.formService.gameForms.length) {
            this.firstElementIndex += MAX_NB_OF_FORMS_PER_PAGE;

            if (this.lastElementIndex + MAX_NB_OF_FORMS_PER_PAGE < this.formService.gameForms.length) {
                this.lastElementIndex = this.firstElementIndex + (MAX_NB_OF_FORMS_PER_PAGE - 1);
            } else {
                this.lastElementIndex = this.formService.gameForms.length - 1;
            }

            this.addCurrentPageGameForms();
        }
    }

    previousPageGameForms() {
        //const 4
        if (this.firstElementIndex - MAX_NB_OF_FORMS_PER_PAGE >= 0) {
            this.firstElementIndex -= MAX_NB_OF_FORMS_PER_PAGE;
            this.lastElementIndex = this.firstElementIndex + (MAX_NB_OF_FORMS_PER_PAGE - 1);

            this.addCurrentPageGameForms();
        }
    }

    addCurrentPageGameForms() {
        this.currentPageGameFormList = new Array(this.lastElementIndex - this.firstElementIndex + 1);

        for (let index: number = 0; index < this.currentPageGameFormList.length; index++) {
            this.currentPageGameFormList[index] = this.formService.gameForms[index + this.firstElementIndex];
        }
    }
}
