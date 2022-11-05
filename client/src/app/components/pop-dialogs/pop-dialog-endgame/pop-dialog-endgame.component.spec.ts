import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PopDialogEndgameComponent } from './pop-dialog-endgame.component';

describe('PopDialogEndgameComponent', () => {
    let component: PopDialogEndgameComponent;
    let fixture: ComponentFixture<PopDialogEndgameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogEndgameComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogEndgameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
