import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
    override off(event: string) {
        this.disconnect();
    }
}

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        dialog = jasmine.createSpyObj('MatDialog', ['open']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: SocketClientService, useValue: socketClientServiceMock },
                { provide: MatDialog, useValue: dialog },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return socketId()', () => {
        const socketID = 'Simpson';
        socketClientServiceMock.socket.id = socketID;
        expect(component.socketId).toEqual(socketID);
    });

    it('should return socketId()', () => {
        const socketID = '';
        socketClientServiceMock.socket.id = socketID;
        expect(component.socketId).toEqual('');
    });

    it('should open dialog()', () => {
        component.openDialog();
        expect(dialog['open']).toHaveBeenCalled();
    });

    it('should call socket event', () => {
        const spy = spyOn(console, 'log');
        socketTestHelper.peerSideEmit('connect');

        component['configureBaseSocketFeatures']();
        expect(spy).toHaveBeenCalled();
    });
});
