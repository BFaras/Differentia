import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateGameService } from '@app/services/create-game.service';
import { JoinGameService } from '@app/services/join-game.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';

import { PopDialogWaitingForPlayerComponent } from './pop-dialog-waiting-for-player.component';

describe('PopDialogWaitingForPlayerComponent', () => {
    let component: PopDialogWaitingForPlayerComponent;
    let fixture: ComponentFixture<PopDialogWaitingForPlayerComponent>;
    let socketSpy: jasmine.SpyObj<SocketClientService>;
    let startUpGameService: jasmine.SpyObj<StartUpGameService>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let joinGameService: jasmine.SpyObj<JoinGameService>;
    let createGameService: jasmine.SpyObj<CreateGameService>;
    let router: jasmine.SpyObj<Router>;

    beforeAll(async () => {
        socketSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogWaitingForPlayerComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: StartUpGameService, useValue: startUpGameService },
                { provide: SocketClientService, useValue: socketSpy },
                { provide: MatDialog, useValue: dialog },
                { provide: JoinGameService, useValue: joinGameService },
                { provide: CreateGameService, useValue: createGameService },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogWaitingForPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call configure socket in NgonInit', async () => {
        const spy = spyOn(component, <any>'configureWaitingPopUpSocketFeatures');
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
        expect(socketSpy['connect']).toHaveBeenCalled();
    });

    it('should send a socket in NgonInit', async () => {
        const spy = spyOn(component, <any>'openRefusedDialog');
        component['openRefusedDialog'];
        expect(spy).toHaveBeenCalled();
    });
});
