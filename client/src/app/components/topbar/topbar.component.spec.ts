import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';
import { TopbarComponent } from './topbar.component';

describe('TopbarComponent', () => {
    let component: TopbarComponent;
    let fixture: ComponentFixture<TopbarComponent>;
    let socketTestHelper: SocketTestHelper;
    let socketService: SocketClientService;

    beforeAll(() => {
        socketService = new SocketClientService();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TopbarComponent],
            providers: [{ provide: SocketClientService, useValue: socketService }],
        }).compileComponents();
        fixture = TestBed.createComponent(TopbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.ngOnInit();
    });

    it('should send event get clue for player to server on sendClueEventToServer()', () => {
        const spy = spyOn(socketService, 'send');
        expect(spy).toHaveBeenCalledWith('get clue for player');
    });
});
