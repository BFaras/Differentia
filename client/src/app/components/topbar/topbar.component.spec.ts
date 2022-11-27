import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { ClueInformations } from '@common/clue-informations';
import { Socket } from 'socket.io-client';
import { TopbarComponent } from './topbar.component';

fdescribe('TopbarComponent', () => {
    let component: TopbarComponent;
    let fixture: ComponentFixture<TopbarComponent>;
    let socketTestHelper: SocketTestHelper;
    let socketService: SocketClientService;

    beforeEach(async () => {
        socketService = new SocketClientService();
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;

        await TestBed.configureTestingModule({
            declarations: [TopbarComponent],
            providers: [{ provide: SocketClientService, useValue: socketService }],
        }).compileComponents();
        fixture = TestBed.createComponent(TopbarComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should send event get clue for player to server on sendClueEventToServer()', () => {
        const spy = spyOn(socketService, 'send');
        component.sendClueEventToServer();
        expect(spy).toHaveBeenCalledWith('get clue for player');
    });

    it('should decrement the amount of clue on a Clue with quadrant of difference event', () => {
        const clueInformations: ClueInformations = {
            clueAmountLeft: 2,
            clueDifferenceQuadrant: 4,
        };
        const expectedAmountOfClues = clueInformations.clueAmountLeft - 1;
        socketTestHelper.peerSideEmit('Clue with quadrant of difference', clueInformations);
        expect(component.clueAmountLeft).toEqual(expectedAmountOfClues);
    });

    it('should set the clue amount left at 0 on a Clue with difference pixels event', () => {
        const expectedAmountOfClues = 0;
        socketTestHelper.peerSideEmit('Clue with difference pixels');
        expect(component.clueAmountLeft).toEqual(expectedAmountOfClues);
    });
});
