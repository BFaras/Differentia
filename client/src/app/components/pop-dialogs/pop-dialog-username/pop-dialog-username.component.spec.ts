import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';

import { PopDialogUsernameComponent } from './pop-dialog-username.component';

describe('PopDialogUsernameComponent', () => {
    let component: PopDialogUsernameComponent;
    let fixture: ComponentFixture<PopDialogUsernameComponent>;
    let socketSpy: jasmine.SpyObj<SocketClientService>;
    let startUpGameService: jasmine.SpyObj<StartUpGameService>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeAll(async () => {
        socketSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send', 'off']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogUsernameComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: StartUpGameService, useValue: startUpGameService },
                { provide: SocketClientService, useValue: socketSpy },
                { provide: MatDialog, useValue: dialog },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(PopDialogUsernameComponent);
        component = fixture.componentInstance;
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

    it('should call configure socket in NgonInit', async () => {
        const spy = spyOn(component, <any>'configureUsernamePopUpSocketFeatures');
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
        expect(socketSpy['connect']).toHaveBeenCalled();
    });

    it('should call configure socket in NgonInit', async () => {
        spyOn(component, <any>'configureUsernamePopUpSocketFeatures').and.callThrough();
        await component.ngOnInit();
        expect(socketSpy['on']).toHaveBeenCalled();
    });
});
