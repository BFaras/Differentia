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

    it('should decrement the amount of clue on a Clue with quadrant of difference event', () => {
        const expectedAmountOfClues = component.clueAmountLeft - 1;
        socketTestHelper.emit('Clue with quadrant of difference');
        expect(component.clueAmountLeft).toEqual(expectedAmountOfClues);
    });

    it('should set the clue amount left at 0 on a Clue with difference pixels event', () => {
        const expectedAmountOfClues = 0;
        socketTestHelper.emit('Clue with difference pixels');
        expect(component.clueAmountLeft).toEqual(expectedAmountOfClues);
    });
});
