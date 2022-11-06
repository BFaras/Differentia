import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { FormService } from '@app/services/form.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { Constants } from '@common/config';
import { Socket } from 'socket.io-client';
import { ListGameFormComponent } from './list-game-form.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
}

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
    let formServiceSpy: jasmine.SpyObj<FormService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    let formService: FormService;

    beforeAll(async () => {
        formServiceSpy = jasmine.createSpyObj('FormService', ['receiveGameInformations', 'deleteGameForm']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ListGameFormComponent],
            providers: [
                { provide: FormService, useValue: formServiceSpy },
                { provide: SocketClientService, useValue: socketClientServiceMock },
                { provide: MatSnackBar, useValue: snackBarSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListGameFormComponent);
        listGameFormComp = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        jasmine.clock().install();

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
        expect(listGameFormComp.lastElementIndex).toEqual(listGameFormComp.firstElementIndex + formService.gameForms.length - 1);
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

    it('should be able to delete a gameForm', () => {
        formService.gameForms = gameFormsInTestFormService;
        const gameName = 'Dog game';
        listGameFormComp.deleteGameForm(gameName);
        expect(formService.gameToDelete).toEqual(gameName);
    });

    it('should call config when deleting a gameForm', () => {
        const gameName = 'Dog game';
        const configSpy = spyOn(listGameFormComp, <any>'config').and.callThrough();
        listGameFormComp.deleteGameForm(gameName);
        expect(configSpy).toHaveBeenCalled();
    });

    it('should not call socket in config', () => {
        let gameName = '';
        socketTestHelper.peerSideEmit('Page reloaded', gameName);
        listGameFormComp['config'](gameName);

        expect(listGameFormComp['messageForUpdate']).toEqual('');
    });

    it('should call socket in config', () => {
        let gameName = 'Lucky';
        socketTestHelper.peerSideEmit('Page reloaded', gameName);
        listGameFormComp['config'](gameName);

        expect(listGameFormComp['messageForUpdate']).toEqual('Reload');
        expect(snackBarSpy['open']).toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
        jasmine.clock().uninstall();
    });
});
