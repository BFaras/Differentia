import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { Socket } from 'socket.io-client';

import { PopDialogUsernameComponent } from './pop-dialog-username.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
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
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: StartUpGameService, useValue: startUpGameServiceSpy },
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

    it('should start waiting in line', () => {
        component.gameInfo['multiFlag'] = false;
        const spy = spyOn(component, <any>'openDialog');
        socketTestHelper.peerSideEmit('username valid');
        component['configureUsernamePopUpSocketFeatures']();
        expect(startUpGameServiceSpy.startUpWaitingLine).toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should open dialog if game info multiflag is true', () => {
        component.gameInfo['multiFlag'] = true;
        const spy = spyOn(component, <any>'openDialog');
        socketTestHelper.peerSideEmit('username valid');
        component['configureUsernamePopUpSocketFeatures']();
        expect(spy).toHaveBeenCalled();
    });

    it('should not close dialog when calling closeGameDialog', () => {
        const gameName = 'car game';
        component.gameInfo.nameGame = 'red sky';
        component['closeGameDialogAfterDelete'](gameName);
        expect(dialog['closeAll']).not.toHaveBeenCalled();
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
        let fixture1 = TestBed.createComponent(PopDialogUsernameComponent);
        let component1 = fixture1.componentInstance;
        const gameName = ['car game', 'blue sky'];
        component.gameInfo.nameGame = gameName[0];
        component1.gameInfo.nameGame = gameName[1];
        const closeDialogSpy = spyOn(component, <any>'closeGameDialogAfterDelete');
        socketTestHelper.peerSideEmit('close popDialogUsername', gameName);
        component['configureUsernamePopUpSocketFeatures']();
        expect(closeDialogSpy).toHaveBeenCalledTimes(2);
    });

    it('should not close dialog another game is deleted', () => {
        const gameName = 'car game';
        component.gameInfo.nameGame = 'blue game';
        socketTestHelper.peerSideEmit('close popDialogUsername', gameName);
        component['closeGameDialogAfterDelete'](gameName);
        expect(dialog['closeAll']).not.toHaveBeenCalled();
    });

    it('should open the dialog when calling openDialog', () => {
        component['openClassicDialog']();
        expect(dialog['open']).toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
