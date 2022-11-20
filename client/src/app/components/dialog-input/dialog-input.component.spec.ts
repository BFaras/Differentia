import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameTimeSetting } from '@app/interfaces/game-time-setting';

import { DialogInputComponent } from './dialog-input.component';

describe('DialogInputComponent', () => {
    let component: DialogInputComponent;
    let fixture: ComponentFixture<DialogInputComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<DialogInputComponent, any>>;
    let gameSettings: GameTimeSetting[];

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
        let initialTime = component.initialTimeInput.nativeElement.value;
        let penaltyTime = component.penaltyTimeInput.nativeElement.value;
        let savedTime = component.savedTimeInput.nativeElement.value;
        component.submitTimes();
        expect(component.timeConstants).toEqual({ initialTime, penaltyTime, savedTime });
        expect(dialogRef['close']).toHaveBeenCalled();
    });

    it('should validate the time if its a number above 0', () => {
        component.initialTimeInput.nativeElement.value = 40;
        component.validateTimeType(component.initialTimeInput, 0);
        expect(component.timeValid[0]).toBeTrue();
        expect(component.onlyQuitButton).toBeFalse();
    });

    it('should not validate the time ', () => {
        component.initialTimeInput.nativeElement.value = 'bluee';
        component.validateTimeType(component.initialTimeInput, 0);
        expect(component.timeValid[0]).toBeFalse();
        expect(component.onlyQuitButton).toBeTrue();
    });

    it('should not validate the time ', () => {
        component.initialTimeInput.nativeElement.value = '';
        component.penaltyTimeInput.nativeElement.value = '';
        component.savedTimeInput.nativeElement.value = '';

        component.validateTimeType(component.initialTimeInput, 0);
        expect(component.onlyQuitButton).toBeTrue();
    });
});
