import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';

import { PopDialogWarningComponent } from './pop-dialog-warning.component';
export class SocketClientServiceMock extends SocketClientService {}

describe('PopDialogWarningComponent', () => {
    let component: PopDialogWarningComponent;
    let fixture: ComponentFixture<PopDialogWarningComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogWarningComponent, any>>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    beforeAll(async () => {
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogWarningComponent],
            imports: [MatIconModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: SocketClientService, useValue: socketClientServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogWarningComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should apply action', () => {
        component.applyAction();
        expect(dialogRef['close']).toHaveBeenCalled();
    });
    it('should cancel action', () => {
        component.cancelAction();
        expect(dialogRef['close']).toHaveBeenCalled();
    });
});
