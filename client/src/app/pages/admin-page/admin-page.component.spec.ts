import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { AdminPageComponent } from './admin-page.component';

export class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
}

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;

    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [AdminPageComponent],
            providers: [
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: SocketClientService, useValue: socketClientServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call method of Matdialog', () => {
        const spy = spyOn(component['dialog'], 'open');
        component.openDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('should open dialog to reset data', () => {
        const dialogSpy = spyOn(component['dialog'], 'open');
        component.openResetDialog();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should reset the game form list', () => {
        const value = 'Hello';
        const socketSpy = spyOn(socketClientServiceMock, 'send');

        component.openDeleteGamesDialog(value);
        socketTestHelper.peerSideEmit('Delete or reset applied on gameForm');

        socketTestHelper.peerSideEmit('Ready to reset game list', value);
        expect(socketSpy).toHaveBeenCalledTimes(2);
    });
});
