import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PopDialogEndgameComponent } from './pop-dialog-endgame.component';

describe('PopDialogEndgameComponent', () => {
    let component: PopDialogEndgameComponent;
    let fixture: ComponentFixture<PopDialogEndgameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogEndgameComponent],
            imports: [MatDialogModule, MatIconModule],
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
