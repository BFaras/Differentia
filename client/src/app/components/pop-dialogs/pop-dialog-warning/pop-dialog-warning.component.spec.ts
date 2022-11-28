import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { PopDialogWarningComponent } from './pop-dialog-warning.component';

describe('PopDialogWarningComponent', () => {
    let component: PopDialogWarningComponent;
    let fixture: ComponentFixture<PopDialogWarningComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogWarningComponent, any>>;

    beforeAll(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogWarningComponent],
            providers: [{ provide: MatDialogRef, useValue: dialogRef }],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogWarningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should apply action', () => {
        const eventName = 'Oui';
        component['value'] = true;
        component.applyAction();
        expect(dialogRef['close']).toHaveBeenCalledWith({ event: eventName, data: component['value'] });
    });
    it('should cancel action', () => {
        const eventName = 'Non';

        component.cancelAction();
        expect(dialogRef['close']).toHaveBeenCalledWith({ event: eventName });
        expect(component['value']).toBeFalse();
    });
});
