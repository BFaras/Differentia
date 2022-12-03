import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTime } from '@app/classes/record-time';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { RESET_MSG_GAME_LIST, SNACKBAR_DURATION } from '@app/const/client-consts';
import { CommunicationService } from '@app/services/communication.service';
import { FormService } from '@app/services/form.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { Constants } from '@common/config';
import { MSG_RESET_ALL_TIME, MSG_RESET_TIME } from '@common/const';
import { Game } from '@common/game';
import { of } from 'rxjs/internal/observable/of';

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
    const games: Game[] = [
        {
            name: 'Car game',
            numberOfDifferences: 7,
            times: { soloGameTimes: [new RecordTime('00:00', 'playerUsername')], multiplayerGameTimes: [new RecordTime('00:00', 'playerUsername')] },
            images: ['Car.bmp', 'Cardiff.bmp'],
            differencesList: [[]],
        },
    ];
    let listGameFormComp: ListGameFormComponent;
    let fixture: ComponentFixture<ListGameFormComponent>;
    let formServiceSpy: jasmine.SpyObj<FormService>;
    let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let router: jasmine.SpyObj<Router>;

    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    let formService: FormService;

    beforeAll(async () => {
        formServiceSpy = jasmine.createSpyObj('FormService', ['receiveGameInformations', 'deleteGameForm']);
        snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
        communicationSpy = jasmine.createSpyObj('CommunicationService', ['deleteGame']);
        router = jasmine.createSpyObj('Router', ['navigate', 'parseUrl']);

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
                { provide: Router, useValue: router },
                { provide: CommunicationService, useValue: communicationSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ListGameFormComponent);
        listGameFormComp = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        jasmine.clock().install();

        formService = listGameFormComp.formService;
        communicationSpy['deleteGame'].and.returnValue(of(games));

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
        expect(listGameFormComp.lastElementIndex - 3).toEqual(listGameFormComp.firstElementIndex + formService.gameForms.length - 1);
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

    it('should be able to delete a gameForm', async () => {
        formService.gameForms = gameFormsInTestFormService;
        const gameName = 'Dog game';
        await listGameFormComp.deleteAndRefreshGames(gameName);
        expect(communicationSpy['deleteGame']).toHaveBeenCalled();
    });

    it('should not call socket in config', () => {
        const gameName = '';
        const routerMock = TestBed.inject(Router);
        // @ts-ignore: force this private property value for testing.
        routerMock.url = '/fakeLocation';
        const spy = spyOn(listGameFormComp, <any>'refreshGames');
        socketTestHelper.peerSideEmit('Page reloaded', gameName);
        listGameFormComp['config'](gameName);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call config when deleting a gameForm', async () => {
        const gameName = 'Dog game';
        const configSpy = spyOn(listGameFormComp, <any>'config').and.callThrough();
        await listGameFormComp.deleteAndRefreshGames(gameName);
        jasmine.clock().tick(100);
        expect(configSpy).toHaveBeenCalled();
    });

    it('should call socket <Page reloaded> in config', () => {
        const gameName = 'Lucky';
        const routerMock = TestBed.inject(Router);
        // @ts-ignore: force this private property value for testing.
        routerMock.url = '/admin';
        const snackBar = spyOn(listGameFormComp, <any>'openSnackBar');
        const spy = spyOn(listGameFormComp, <any>'refreshGames');
        socketTestHelper.peerSideEmit('Page reloaded', gameName);
        listGameFormComp['config'](gameName);
        expect(snackBar).toHaveBeenCalled();
        expect(listGameFormComp['gameListToRefresh']).toBeTrue();
        expect(spy).toHaveBeenCalled();
        expect(listGameFormComp['messageForUpdate']).toEqual('');
        expect(router['url']).toEqual('/admin');
    });

    it('should execute instructions in socket <game list updated>', () => {
        const gameName = 'Lucky';
        socketClientServiceMock.socket.id = 'Lucky';
        const spy = spyOn(listGameFormComp, <any>'refreshGames');
        socketTestHelper.peerSideEmit('game list updated', gameName);
        listGameFormComp['config'](gameName);
        expect(listGameFormComp['gameListToRefresh']).toBeTrue();
        expect(spy).toHaveBeenCalled();
    });

    it('should not execute instructions in socket <game list updated>', () => {
        const gameName = 'Lucky';
        socketClientServiceMock.socket.id = 'Bruh';
        const spy = spyOn(listGameFormComp, <any>'refreshGames');
        socketTestHelper.peerSideEmit('game list updated', gameName);
        listGameFormComp['config'](gameName);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call refreshGames and ngOnInit', () => {
        const spy = spyOn(listGameFormComp, <any>'ngOnInit');
        const nextPageSpy = spyOn(listGameFormComp, 'nextPageGameForms');
        const previousPageSpy = spyOn(listGameFormComp, 'previousPageGameForms');

        listGameFormComp['refreshGames'](true);
        expect(listGameFormComp['gameListToRefresh']).toBeFalse();
        expect(listGameFormComp['messageForUpdate']).toEqual('');
        expect(listGameFormComp['firstElementIndex']).toEqual(0);
        expect(listGameFormComp['lastElementIndex']).toEqual(3);
        expect(spy).toHaveBeenCalled();
        expect(nextPageSpy).toHaveBeenCalled();
        expect(previousPageSpy).toHaveBeenCalled();
    });

    it('should call refreshGames but not ngOnInit', () => {
        const spy = spyOn(listGameFormComp, <any>'ngOnInit');
        listGameFormComp['refreshGames'](false);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should open snackbar to delete one game', () => {
        const gameName = 'hi';
        listGameFormComp['openSnackBar'](gameName);
        expect(snackBarSpy['open']).toHaveBeenCalledWith(`Le jeu ${gameName} a été supprimé :(`, 'OK', {
            horizontalPosition: listGameFormComp['horizontalPosition'],
            verticalPosition: listGameFormComp['verticalPosition'],
            duration: SNACKBAR_DURATION,
        });
    });

    it('should open snackbar to delete all the games', () => {
        const gameName = ['hi', 'AUGH'];
        listGameFormComp['openSnackBar'](gameName);
        expect(snackBarSpy['open']).toHaveBeenCalledWith(RESET_MSG_GAME_LIST, 'OK', {
            horizontalPosition: listGameFormComp['horizontalPosition'],
            verticalPosition: listGameFormComp['verticalPosition'],
            duration: SNACKBAR_DURATION,
        });
    });

    it('should open snackbar for the reset of all times board', () => {
        listGameFormComp['openSnackBar'](MSG_RESET_ALL_TIME);
        expect(snackBarSpy['open']).toHaveBeenCalledWith(MSG_RESET_ALL_TIME, 'OK', {
            horizontalPosition: listGameFormComp['horizontalPosition'],
            verticalPosition: listGameFormComp['verticalPosition'],
            duration: SNACKBAR_DURATION,
        });
    });

    it('should open snackbar for the reset of one times board', () => {
        listGameFormComp['openSnackBar'](MSG_RESET_TIME);
        expect(snackBarSpy['open']).toHaveBeenCalledWith(MSG_RESET_TIME, 'OK', {
            horizontalPosition: listGameFormComp['horizontalPosition'],
            verticalPosition: listGameFormComp['verticalPosition'],
            duration: SNACKBAR_DURATION,
        });
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
        jasmine.clock().uninstall();
    });
});
