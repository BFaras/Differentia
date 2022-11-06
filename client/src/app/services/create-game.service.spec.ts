import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
import { CreateGameService } from './create-game.service';
import { SocketClientService } from './socket-client.service';

describe('CreateGameService', () => {
    const testGameName = 'Test Game';
    let service: CreateGameService;
    let socketService: SocketClientService;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CreateGameService);
        socketService = TestBed.inject(SocketClientService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should createGame() call addPlayerOnWaitingList() of CreateGameService', () => {
        const addWaitingPlayerSpy = spyOn<any>(service, 'addPlayerOnWaitingList').and.callThrough();
        service.createGame(testGameName);
        expect(addWaitingPlayerSpy).toHaveBeenCalled();
    });

    it('should addPlayer call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service['addPlayerOnWaitingList'](testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('should leaveWaitingList() call send', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service.leaveWaitingList(testGameName);
        expect(spy).toHaveBeenCalled();
    });
});
