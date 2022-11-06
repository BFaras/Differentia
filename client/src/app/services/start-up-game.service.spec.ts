import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { DEFAULT_USERNAME } from '@common/const';
import { Socket } from 'socket.io-client';
import { CreateGameService } from './create-game.service';
import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';
import { StartUpGameService } from './start-up-game.service';

describe('StartUpGameService', () => {
    const testGameName = 'Test Game';
    const multiPlayerGameInfo: any = {
        isPlayerWaiting: true,
        multiFlag: true,
    };
    const createGameInfo: any = {
        isPlayerWaiting: false,
        multiFlag: false,
    };
    let routerSpy = { navigate: jasmine.createSpy('navigate') };
    let startUpGameService: StartUpGameService;
    let createGameService: CreateGameService;
    let joinGameService: JoinGameService;
    let socketService: SocketClientService;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Router, useValue: routerSpy }],
        });

        startUpGameService = TestBed.inject(StartUpGameService);
        createGameService = TestBed.inject(CreateGameService);
        socketService = TestBed.inject(SocketClientService);
        joinGameService = TestBed.inject(JoinGameService);
        socketTestHelper = new SocketTestHelper();
        socketService.socket = socketTestHelper as unknown as Socket;
    });

    it('should be created', () => {
        expect(startUpGameService).toBeTruthy();
    });

    it('should multiplayerGame() call joinGame() of JoinGameService if a player is waiting ', () => {
        const spy = spyOn(joinGameService, 'joinGame').and.callThrough();
        startUpGameService['multiplayerGame'](multiPlayerGameInfo, DEFAULT_USERNAME);
        expect(spy).toHaveBeenCalled();
    });

    it('should multiplayerGame() call createGame() of CreateGameService if no player is waiting ', () => {
        const spy = spyOn(createGameService, 'createGame').and.callThrough();
        startUpGameService['multiplayerGame'](createGameInfo, DEFAULT_USERNAME);
        expect(spy).toHaveBeenCalled();
    });

    it('should startUpWaitingLine() call multiplayerGame() of StartUpGameService if there is the multiplayer flag', () => {
        const spy = spyOn(startUpGameService, <any>'multiplayerGame').and.callThrough();
        startUpGameService.startUpWaitingLine(multiPlayerGameInfo, DEFAULT_USERNAME);
        expect(spy).toHaveBeenCalled();
    });

    it('should startUpWaitingLine() call soloGame() of StartUpGameService if there is not the multiplayer flag', () => {
        const spy = spyOn(startUpGameService, <any>'soloGame').and.callThrough();
        startUpGameService.startUpWaitingLine(createGameInfo, DEFAULT_USERNAME);
        expect(spy).toHaveBeenCalled();
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

    it('should startMatch() call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService.startMatch(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('should startMatch() navigate to the right URL', () => {
        startUpGameService.startMatch(testGameName);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/game']);
    });
});
