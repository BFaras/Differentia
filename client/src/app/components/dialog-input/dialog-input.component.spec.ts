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
    let gameSettings: GameTimeSetting[];

    beforeEach(async () => {
        gameSettings = [
            { inputName: 'Temps initial', defaultTime: 30, placeHolder: 'Temps par défaut: 30s', valueUnit: 'secondes' },
            { inputName: 'Temps de pénalité', defaultTime: 5, placeHolder: 'Temps par défaut: 5s', valueUnit: 'secondes' },
            { inputName: 'Temps gagné', defaultTime: 5, placeHolder: 'Temps par défaut: 5s', valueUnit: 'secondes' },
        ];
        await TestBed.configureTestingModule({
            declarations: [DialogInputComponent],
            imports: [MatFormFieldModule, MatInputModule, MatDialogModule, BrowserAnimationsModule],
            providers: [
                { provide: MatDialogRef, useValue: {} },
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
});
