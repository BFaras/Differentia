import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { CLASSIC_MODE, LIMITED_TIME_MODE } from '@common/const';
import { Socket } from 'socket.io-client';

import { PopDialogUsernameComponent } from './pop-dialog-username.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off(event: string) {
        this.disconnect();
    }
}

describe('PopDialogUsernameComponent', () => {
    let component: PopDialogUsernameComponent;
    let fixture: ComponentFixture<PopDialogUsernameComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let startUpGameServiceSpy: jasmine.SpyObj<StartUpGameService>;
    let socketTestHelper: SocketTestHelper;
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogUsernameComponent, any>>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let router: jasmine.SpyObj<Router>;
    const nameGame = 'red sky';

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        startUpGameServiceSpy = jasmine.createSpyObj('StartUpGameService', ['startUpWaitingLine']);
        dialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        router = jasmine.createSpyObj('Router', ['navigate']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogUsernameComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: StartUpGameService, useValue: startUpGameServiceSpy },
                { provide: MAT_DIALOG_DATA, useValue: { nameGame } },
                { provide: SocketClientService, useValue: socketClientServiceMock },
                { provide: MatDialog, useValue: dialog },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(PopDialogUsernameComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the button should not be disabled if the input value is not undefined', () => {
        component.disabledButton = true;
        component.username.nativeElement.value = 'test';
        component.inputChanged();
        expect(component.disabledButton).toBeFalsy();
    });

    it('the button should be disabled if the input value is undefined', () => {
        component.disabledButton = true;
        component.username.nativeElement.value = '';
        component.inputChanged();
        expect(component.disabledButton).toBeTrue();
    });

    it('should set the user to not valid', () => {
        socketTestHelper.peerSideEmit('username not valid');
        component['configureUsernamePopUpSocketFeatures']();
        expect(component.usernameNotValid).toEqual(true);
    });

    it('should call dialogRef ', () => {
        socketTestHelper.peerSideEmit('username valid');
        component['configureUsernamePopUpSocketFeatures']();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should start waiting line and open classicDialog if multiFlag is true', () => {
        component.gameInfo['multiFlag'] = true;
        const spy = spyOn(component, <any>'openClassicDialog');
        component['configureUsernamePopUpSocketFeatures']();
        socketTestHelper.peerSideEmit(`${CLASSIC_MODE}`);
        expect(startUpGameServiceSpy['startUpWaitingLine']).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should start waiting line and navigate to /game if multiFlag is false', () => {
        component.gameInfo['multiFlag'] = false;
        component['configureUsernamePopUpSocketFeatures']();
        socketTestHelper.peerSideEmit(`${CLASSIC_MODE}`);
        expect(startUpGameServiceSpy['startUpWaitingLine']).toHaveBeenCalled();
        expect(router['navigate']).toHaveBeenCalledWith(['/game']);
    });

    it('should open dialog if game info multiflag is true', () => {
        const spy = spyOn(component, <any>'openLimitedTimeDialog');
        component['configureUsernamePopUpSocketFeatures']();
        socketTestHelper.peerSideEmit(`open the ${LIMITED_TIME_MODE} pop-dialog`);
        expect(spy).toHaveBeenCalled();
    });

    it('openLimitedTimeDialog should open dialog', () => {
        component['configureUsernamePopUpSocketFeatures']();
        socketTestHelper.peerSideEmit(`open the ${LIMITED_TIME_MODE} pop-dialog`);
        expect(dialog['open']).toHaveBeenCalled();
    });

    it('should close dialog when calling closeGameDialog', () => {
        const gameName = 'car game';
        component.gameInfo.nameGame = gameName;
        const spy = spyOn(socketClientServiceMock, 'send');
        component['closeGameDialogAfterDelete'](gameName);
        expect(dialog['closeAll']).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('should close one dialog', () => {
        const gameName = 'car game';
        component.gameInfo.nameGame = gameName;
        const closeDialogSpy = spyOn(component, <any>'closeGameDialogAfterDelete');
        socketTestHelper.peerSideEmit('close popDialogUsername', gameName);
        component['configureUsernamePopUpSocketFeatures']();
        expect(closeDialogSpy).toHaveBeenCalledOnceWith(gameName);
    });

    it('should close many dialogs', () => {
        const fixture1 = TestBed.createComponent(PopDialogUsernameComponent);
        const component1 = fixture1.componentInstance;
        const gameName = ['car game', 'blue sky'];
        component.gameInfo.nameGame = gameName[0];
        component1.gameInfo.nameGame = gameName[1];
        const closeDialogSpy = spyOn(component, <any>'closeGameDialogAfterDelete');
        socketTestHelper.peerSideEmit('close popDialogUsername', gameName);
        component['configureUsernamePopUpSocketFeatures']();
        expect(closeDialogSpy).toHaveBeenCalledTimes(2);
    });

    it('should not close dialog another game is deleted', () => {
        socketTestHelper.peerSideEmit('close popDialogUsername', nameGame);
        expect(dialog['closeAll']).toHaveBeenCalled();
    });

    it('should open the dialog when calling openDialog', () => {
        component['openClassicDialog']();
        expect(dialog['open']).toHaveBeenCalled();
    });

    it('ngOnDestroy should call off() twice', () => {
        const spy = spyOn(socketClientServiceMock, 'off');
        component['ngOnDestroy']();
        expect(spy).toHaveBeenCalledWith('username valid');
        expect(spy).toHaveBeenCalledWith(`${CLASSIC_MODE}`);
    });
});
