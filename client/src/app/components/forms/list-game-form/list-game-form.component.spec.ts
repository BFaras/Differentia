import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { FormService } from '@app/services/form.service';
import { Constants } from '@common/config';
import { ListGameFormComponent } from './list-game-form.component';

describe('ListGameFormComponent', () => {
    const INITIAL_FIRST_ELEMENT_INDEX = 0;
    const gameFormsInTestFormService = [
        new GameFormDescription('Car game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Bike game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('House game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Plane game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('TV game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Dog game', 'image', new RecordTimesBoard([], [])),
    ];
    const gameFormListWithOnlyOneGame = [new GameFormDescription('Car game', 'image', new RecordTimesBoard([], []))];

    let listGameFormComp: ListGameFormComponent;
    let fixture: ComponentFixture<ListGameFormComponent>;
    let formService: FormService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListGameFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ListGameFormComponent);
        listGameFormComp = fixture.componentInstance;

        formService = listGameFormComp.formService;
        formService.gameForms = gameFormsInTestFormService;
        listGameFormComp.ngOnInit();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(listGameFormComp).toBeTruthy();
    });

    it('should have the right index values when there is only one game in the initial list', () => {
        formService.gameForms = gameFormListWithOnlyOneGame;
        listGameFormComp.ngOnInit();
        expect(listGameFormComp.firstElementIndex).toEqual(INITIAL_FIRST_ELEMENT_INDEX);
        expect(listGameFormComp.lastElementIndex).toEqual(formService.gameForms.length - 1);
    });

    it('should have the right index values when there is more than four games in the initial list', () => {
        expect(listGameFormComp.firstElementIndex).toEqual(INITIAL_FIRST_ELEMENT_INDEX);
        expect(listGameFormComp.lastElementIndex).toEqual(Constants.MAX_NB_OF_FORMS_PER_PAGE - 1);
    });

    it('should have the right index values when the page is changed', () => {
        listGameFormComp.nextPageGameForms();
        expect(listGameFormComp.firstElementIndex).toEqual(Constants.MAX_NB_OF_FORMS_PER_PAGE);
        expect(listGameFormComp.lastElementIndex).toEqual(formService.gameForms.length - 1);
    });

    it('should have the right index values when we cannot change the page anymore', () => {
        listGameFormComp.nextPageGameForms();
        listGameFormComp.nextPageGameForms();
        expect(listGameFormComp.firstElementIndex).toEqual(Constants.MAX_NB_OF_FORMS_PER_PAGE);
        expect(listGameFormComp.lastElementIndex).toEqual(formService.gameForms.length - 1);
    });

    it('should not be able to go to the previous page when we are on the first page', () => {
        listGameFormComp.previousPageGameForms();
        expect(listGameFormComp.firstElementIndex).toEqual(INITIAL_FIRST_ELEMENT_INDEX);
        expect(listGameFormComp.lastElementIndex).toEqual(Constants.MAX_NB_OF_FORMS_PER_PAGE - 1);
    });

    it('should be able to go to the previous page when we are on a page other than the first', () => {
        listGameFormComp.nextPageGameForms();
        listGameFormComp.previousPageGameForms();
        expect(listGameFormComp.firstElementIndex).toEqual(INITIAL_FIRST_ELEMENT_INDEX);
        expect(listGameFormComp.lastElementIndex).toEqual(Constants.MAX_NB_OF_FORMS_PER_PAGE - 1);
    });
});
