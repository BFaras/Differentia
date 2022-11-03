import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';

oidescribe('JoinGameService', () => {
    const testGameName = 'Test Game';
    let service: JoinGameService;
    let socketService: SocketClientService;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(JoinGameService);
        socketService = TestBed.inject(SocketClientService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should joinGame() call send()', () => {
      const potentialAdversaryName = 'testName1234';
      const spy = spyOn(socketService, 'send').and.callThrough();
      service.joinGame(testGameName, potentialAdversaryName);
      expect(spy).toHaveBeenCalled();
  });

    it('should leaveJoiningProcess() call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        service.leaveJoiningProcess(testGameName);
        expect(spy).toHaveBeenCalled();
    });
});
