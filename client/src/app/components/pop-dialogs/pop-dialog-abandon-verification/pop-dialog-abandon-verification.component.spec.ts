import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';

import { PopDialogAbandonVerificationComponent } from './pop-dialog-abandon-verification.component';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
}

describe('PopDialogAbandonVerificationComponent', () => {
    let component: PopDialogAbandonVerificationComponent;
    let fixture: ComponentFixture<PopDialogAbandonVerificationComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogAbandonVerificationComponent],
            imports: [MatIconModule, FormsModule, MatDialogModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: SocketClientService, useValue: socketClientServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogAbandonVerificationComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should use socket', () => {
        const spy = spyOn(socketClientServiceMock, 'send');
        component.abandonGame();
        expect(spy).toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
