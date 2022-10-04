import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DialogInputComponent } from './dialog-input.component';

describe('DialogInputComponent', () => {
    let component: DialogInputComponent;
    let fixture: ComponentFixture<DialogInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogInputComponent],
            imports: [MatFormFieldModule, MatInputModule, MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
