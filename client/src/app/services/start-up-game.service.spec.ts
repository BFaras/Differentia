import { TestBed } from '@angular/core/testing';
//import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { Socket } from 'socket.io-client';
//import { CreateGameService } from './create-game.service';
//import { JoinGameService } from './join-game.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketClientService } from './socket-client.service';
import { StartUpGameService } from './start-up-game.service';

fdescribe('StartUpGameService', () => {
    const testGameName = 'Test Game';
    let startUpGameService: StartUpGameService;
    //  let createGameService: CreateGameService;
    //let joinGameService: JoinGameService;
    let socketService: SocketClientService;
    //let router: Router;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        startUpGameService = TestBed.inject(StartUpGameService);
        // createGameService = TestBed.inject(CreateGameService);
        socketService = TestBed.inject(SocketClientService);
        //joinGameService = TestBed.inject(JoinGameService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should be created', () => {
        expect(startUpGameService).toBeTruthy();
    });

    it('should soloGame call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService['soloGame'](testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('should declineAdversary() call send', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService.declineAdversary(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('should sendUsername() call send', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService.sendUsername(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    /*it('should startMatch() call send', () => {
      const spy = spyOn(socketService, 'send').and.callThrough();
      startUpGameService.startMatch(testGameName);
      expect(spy).toHaveBeenCalled();
  });*/
});
