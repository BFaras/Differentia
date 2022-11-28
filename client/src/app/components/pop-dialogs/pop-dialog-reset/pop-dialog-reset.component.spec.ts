import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { EMPTY_MESSAGE, RESET_INFO_CONSTANTS, RESET_INFO_GAME_LIST, RESET_INFO_RECORDS_TIME } from '@app/const/client-consts';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';
import { PopDialogResetComponent } from './pop-dialog-reset.component';

export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
}

describe('PopDialogResetComponent', () => {
    let component: PopDialogResetComponent;
    let fixture: ComponentFixture<PopDialogResetComponent>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogResetComponent, any>>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogResetComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: SocketClientService, useValue: socketClientServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get the info to reset', () => {
        component.resetRecordsTimeBoard = true;
        component.resetTimeConstants = true;
        component.resetGameFormList = true;
        component.getInfoToReset();
        expect(component.recordsTime).toEqual(RESET_INFO_RECORDS_TIME);
        expect(component.gameConstants).toEqual(RESET_INFO_CONSTANTS);
        expect(component.gameFormList).toEqual(RESET_INFO_GAME_LIST);
    });

    it('should not have info to reset', () => {
        component.resetRecordsTimeBoard = false;
        component.resetTimeConstants = false;
        component.resetGameFormList = false;
        component.getInfoToReset();
        expect(component.recordsTime).toEqual(EMPTY_MESSAGE);
        expect(component.gameConstants).toEqual(EMPTY_MESSAGE);
        expect(component.gameFormList).toEqual(EMPTY_MESSAGE);
    });

    it('should let a last chance to the client to validate the choice', () => {
        component.resetRecordsTimeBoard = true;
        component.resetTimeConstants = false;
        component.resetGameFormList = true;
        component.validateChoice();
        expect(component.isLastChance).toEqual(true);
        expect(component.isValidChoice).toEqual(true);
    });

    it('should not let a last chance to the client to validate the choice', () => {
        component.resetRecordsTimeBoard = false;
        component.resetTimeConstants = false;
        component.resetGameFormList = false;
        component.validateChoice();
        expect(component.isLastChance).toEqual(false);
        expect(component.isValidChoice).toEqual(false);
    });

    it('should reset the records timeBoard and game constants', () => {
        component.resetRecordsTimeBoard = true;
        component.resetTimeConstants = true;
        let socketSpy = spyOn(socketClientServiceMock, 'send');
        component.resetData();
        expect(socketSpy).toHaveBeenCalled();
    });

    it('should reset the game form list', () => {
        let value = 'Hello';
        component.resetGameFormList = true;
        let socketSpy = spyOn(socketClientServiceMock, 'send');
        component.resetData();
        socketTestHelper.peerSideEmit('Ready to reset game list', value);
        expect(socketSpy).toHaveBeenCalledTimes(2);
    });

    it('should not reset the data', () => {
        component.resetRecordsTimeBoard = false;
        component.resetTimeConstants = false;
        component.resetGameFormList = false;
        component.resetData();
        expect(dialogRef['close']).toHaveBeenCalled();
    });

    it('should let the client modify the choice', () => {
        component.isLastChance = true;
        component.isValidChoice = true;
        component.modifyChoice();
        expect(component.isLastChance).toEqual(false);
        expect(component.isValidChoice).toEqual(false);
    });
});
