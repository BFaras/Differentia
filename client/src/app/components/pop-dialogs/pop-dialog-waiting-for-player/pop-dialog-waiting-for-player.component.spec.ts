import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { CreateGameService } from '@app/services/create-game.service';
import { JoinGameService } from '@app/services/join-game.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { Socket } from 'socket.io-client';
import { PopDialogHostRefusedComponent } from '../pop-dialog-host-refused/pop-dialog-host-refused.component';

import { PopDialogWaitingForPlayerComponent } from './pop-dialog-waiting-for-player.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
}

describe('PopDialogWaitingForPlayerComponent', () => {
    let component: PopDialogWaitingForPlayerComponent;
    let fixture: ComponentFixture<PopDialogWaitingForPlayerComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;
    let startUpGameService: jasmine.SpyObj<StartUpGameService>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogHostRefusedComponent, any>>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let joinGameService: jasmine.SpyObj<JoinGameService>;
    let createGameService: jasmine.SpyObj<CreateGameService>;
    let router: jasmine.SpyObj<Router>;
    let username: string = 'username1';

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        dialog = jasmine.createSpyObj('MatDialog', ['open']);
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        router = jasmine.createSpyObj('Router', ['navigate']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogWaitingForPlayerComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: StartUpGameService, useValue: startUpGameService },
                { provide: SocketClientService, useValue: socketClientServiceMock },
                { provide: MatDialog, useValue: dialog },
                { provide: JoinGameService, useValue: joinGameService },
                { provide: CreateGameService, useValue: createGameService },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogWaitingForPlayerComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should configure socket if someone is trying to join', () => {
        socketTestHelper.peerSideEmit(`${component.gameInfo['nameGame']} someone is trying to join`, username);
        component['configureWaitingPopUpSocketFeatures']();
        expect(component.isSomeoneJoining).toEqual(true);
        expect(component.playerTryingToJoin).toEqual(username);
    });

    it('should configure socket if the player trying to join left', () => {
        socketTestHelper.peerSideEmit(`${component.gameInfo['nameGame']} the player trying to join left`);
        component['configureWaitingPopUpSocketFeatures']();
        expect(component.isSomeoneJoining).toEqual(false);
        expect(component.playerTryingToJoin).toEqual('');
    });

    it('should configure socket if the response on host is present', () => {
        socketTestHelper.peerSideEmit(`${component.gameInfo['nameGame']} response on host presence`, true);
        component['configureWaitingPopUpSocketFeatures']();
        expect(component.isHostPresent).toEqual(true);
    });

    it('should configure socket if the response on host is not present', () => {
        socketTestHelper.peerSideEmit(`${component.gameInfo['nameGame']} response on host presence`, false);
        component['configureWaitingPopUpSocketFeatures']();
        expect(component.isHostPresent).toEqual(false);
    });

    it('should configure socket if the host decline the request', () => {
        const didHostChoseAnother = true;
        const spy = spyOn(component, <any>'openRefusedDialog');
        socketTestHelper.peerSideEmit(`${component.gameInfo['nameGame']} you have been declined`, didHostChoseAnother);
        component['configureWaitingPopUpSocketFeatures']();
        expect(dialogRef.close).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(didHostChoseAnother);
    });

    it('should configure socket if the host accept the request', () => {
        socketTestHelper.peerSideEmit(`${component.gameInfo['nameGame']} you have been accepted`);
        component['configureWaitingPopUpSocketFeatures']();
        expect(dialogRef.close).toHaveBeenCalled();
        expect(router['navigate']).toHaveBeenCalledWith(['/game']);
    });
});
