import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { StartUpGameService } from '@app/services/start-up-game.service';
import { Socket } from 'socket.io-client';
import { PopDialogLimitedTimeModeComponent } from './pop-dialog-limited-time-mode.component';
// import { PopDialogWaitingForPlayerComponent } from './pop-dialog-waiting-for-player.component';

export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off() {
        this.disconnect();
    }
    override send(event: string) {}
}
describe('PopDialogLimitedTimeModeComponent', () => {
    let component: PopDialogLimitedTimeModeComponent;
    let fixture: ComponentFixture<PopDialogLimitedTimeModeComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;
    let startUpGameService: jasmine.SpyObj<StartUpGameService>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogLimitedTimeModeComponent, unknown>>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let router: jasmine.SpyObj<Router>;
    const testUsername = 'testUsername';

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        dialog = jasmine.createSpyObj('MatDialog', ['open']);
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
        router = jasmine.createSpyObj('Router', ['navigate']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PopDialogLimitedTimeModeComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { testUsername } },
                { provide: StartUpGameService, useValue: startUpGameService },
                { provide: SocketClientService, useValue: socketClientServiceMock },
                { provide: MatDialog, useValue: dialog },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PopDialogLimitedTimeModeComponent);
        component = fixture.componentInstance;
        TestBed.inject(SocketClientService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('close() should call dialogRef.close()', () => {
        component.close();
        expect(dialogRef['close']).toHaveBeenCalled();
    });

    it('openWaitingDialog() should call dialog.open()', () => {
        component.openWaitingDialog();
        expect(dialog['open']).toHaveBeenCalled();
    });

    it('should call close(), send() and navigate() on a true response on limited time waiting line', () => {
        const spy = spyOn(socketClientServiceMock, 'send');
        component['configureLimitedTimePopUpSocketFeatures']();
        socketTestHelper.peerSideEmit('response on limited time waiting line', true);
        expect(spy).toHaveBeenCalledWith('launch limited time mode multiplayer match');
        expect(dialogRef['close']).toHaveBeenCalled();
        expect(router['navigate']).toHaveBeenCalledWith(['/game']);
    });

    it('should call close() and openWaitingDialog() on a false response on limited time waiting line', () => {
        const spy = spyOn(component, 'openWaitingDialog');
        component['configureLimitedTimePopUpSocketFeatures']();
        socketTestHelper.peerSideEmit('response on limited time waiting line', false);
        expect(dialogRef['close']).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });
});
