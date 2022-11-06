import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocketClientService } from '@app/services/socket-client.service';

import { PopDialogHostRefusedComponent } from './pop-dialog-host-refused.component';

describe('PopDialogHostRefusedComponent', () => {
    let component: PopDialogHostRefusedComponent;
    let fixture: ComponentFixture<PopDialogHostRefusedComponent>;
    let socketSpy: jasmine.SpyObj<SocketClientService>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        socketSpy = jasmine.createSpyObj('SocketClientService', ['send']);

        await TestBed.configureTestingModule({
            declarations: [PopDialogHostRefusedComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MatDialog, useValue: dialog },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: SocketClientService, useValue: socketSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogHostRefusedComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
