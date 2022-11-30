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

    it('createGame() should call addPlayerOnWaitingList() of CreateGameService', () => {
        const addWaitingPlayerSpy = spyOn<any>(service, 'addPlayerOnWaitingList').and.callThrough();
        service.createGame(testGameName);
        expect(addWaitingPlayerSpy).toHaveBeenCalled();
    });

    it('addPlayer should call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service['addPlayerOnWaitingList'](testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('leaveWaitingList() should call send', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service.leaveWaitingList(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('createLimitedTimeGame() should call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service.createLimitedTimeGame();
        expect(spy).toHaveBeenCalledWith('I am trying to play a limited time game');
    });

    it('leaveLimitedTimeGame() should call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service.leaveLimitedTimeGame();
        expect(spy).toHaveBeenCalledWith('I left from LM');
    });
});
