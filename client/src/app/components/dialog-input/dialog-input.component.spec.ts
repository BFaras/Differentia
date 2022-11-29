import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MSG_ALL_TIME_RATIO, MSG_PENALTY_TIME_RATIO, MSG_SAVED_TIME_RATIO } from '@app/const/client-consts';
import { GameTimeSetting } from '@app/interfaces/game-time-setting';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';

import { DialogInputComponent } from './dialog-input.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
}

describe('DialogInputComponent', () => {
    let component: DialogInputComponent;
    let fixture: ComponentFixture<DialogInputComponent>;
    let gameSettings: GameTimeSetting[];
    let dialogRef: jasmine.SpyObj<MatDialogRef<DialogInputComponent, any>>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        gameSettings = [
            { inputName: 'Temps initial', defaultTime: 30, placeHolder: 'Temps par défaut: 30s', valueUnit: 'secondes' },
            { inputName: 'Temps de pénalité', defaultTime: 5, placeHolder: 'Temps par défaut: 5s', valueUnit: 'secondes' },
            { inputName: 'Temps gagné', defaultTime: 5, placeHolder: 'Temps par défaut: 5s', valueUnit: 'secondes' },
        ];
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            declarations: [DialogInputComponent],
            imports: [MatFormFieldModule, MatInputModule, MatDialogModule, BrowserAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: gameSettings },
                { provide: SocketClientService, useValue: socketClientServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogInputComponent);
        component = fixture.componentInstance;
        TestBed.inject(MAT_DIALOG_DATA);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should submit Times', () => {
        component.initialTimeInput.nativeElement.value = 64;
        component.penaltyTimeInput.nativeElement.value = 10;
        component.savedTimeInput.nativeElement.value = 10;
        let initialTime = Number(component.initialTimeInput.nativeElement.value);
        let penaltyTime = Number(component.penaltyTimeInput.nativeElement.value);
        let savedTime = Number(component.savedTimeInput.nativeElement.value);
        let spySetDefault = spyOn(component, <any>'setDefaultValue');
        let spySocket = spyOn(socketClientServiceMock, 'send');
        component.submitTimes();
        expect(component.timeConstants).toEqual({ initialTime, penaltyTime, savedTime });
        expect(dialogRef['close']).toHaveBeenCalled();
        expect(spySetDefault).toHaveBeenCalled();
        expect(spySocket).toHaveBeenCalled();
    });

    it('should validate the time if its a number above 0', () => {
        component.initialTimeInput.nativeElement.value = 40;
        component.validateTimeType(component.initialTimeInput, 0);
        expect(component.timeValid[0]).toBeTrue();
        expect(component.onlyQuitButton).toBeFalse();
    });

    it('should not validate the time ', () => {
        component.initialTimeInput.nativeElement.value = 2000;
        component.validateTimeType(component.initialTimeInput, 0);
        expect(component.timeValid[0]).toBeFalse();
        expect(component.onlyQuitButton).toBeTrue();
    });

    it('should not validate the time because nothing changed ', () => {
        component.initialTimeInput.nativeElement.value = '';
        component.penaltyTimeInput.nativeElement.value = '';
        component.savedTimeInput.nativeElement.value = '';

        component.validateTimeType(component.initialTimeInput, 0);
        expect(component.onlyQuitButton).toBeTrue();
    });

    it('should not validate the penalty time ratio', () => {
        component.initialTimeInput.nativeElement.value = 40;
        component.penaltyTimeInput.nativeElement.value = 22;
        component.savedTimeInput.nativeElement.value = 8;

        component.validateTimesRatio();
        expect(component.timeRatioValid).toBeFalse();
        expect(component.msgTimeRatio).toEqual(MSG_PENALTY_TIME_RATIO);
    });

    it('should not validate the saved time ratio', () => {
        component.initialTimeInput.nativeElement.value = 40;
        component.penaltyTimeInput.nativeElement.value = 7;
        component.savedTimeInput.nativeElement.value = 18;

        component.validateTimesRatio();
        expect(component.timeRatioValid).toBeFalse();
        expect(component.msgTimeRatio).toEqual(MSG_SAVED_TIME_RATIO);
    });

    it('should validate the time ratio', () => {
        component.initialTimeInput.nativeElement.value = 40;
        component.penaltyTimeInput.nativeElement.value = 7;
        component.savedTimeInput.nativeElement.value = 4;

        component.validateTimesRatio();
        expect(component.timeRatioValid).toBeTrue();
    });

    it('should not validate the time ratio', () => {
        component.initialTimeInput.nativeElement.value = 40;
        component.penaltyTimeInput.nativeElement.value = 17;
        component.savedTimeInput.nativeElement.value = 34;

        component.validateTimesRatio();
        expect(component.timeRatioValid).toBeFalse();
        expect(component.msgTimeRatio).toEqual(MSG_ALL_TIME_RATIO);
    });

    it('should set the default time value', () => {
        component.initialTimeInput.nativeElement.value = '';
        component.penaltyTimeInput.nativeElement.value = '';
        component.savedTimeInput.nativeElement.value = '';

        component['setDefaultValue']();
        expect(component.initialTimeInput.nativeElement.value).toEqual('30');
        expect(component.penaltyTimeInput.nativeElement.value).toEqual('5');
        expect(component.savedTimeInput.nativeElement.value).toEqual('5');
    });

    it('should accept time range', () => {
        component.initialTimeInput.nativeElement.value = 60;
        expect(component['verifyTimeRange'](component.initialTimeInput)).toBeTrue();
    });

    it('should not accept time range', () => {
        component.initialTimeInput.nativeElement.value = -2;
        expect(component['verifyTimeRange'](component.initialTimeInput)).toBeFalse();
    });
});
