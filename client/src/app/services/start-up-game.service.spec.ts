/* eslint-disable max-len */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { PopUpData } from '@app/interfaces/pop-up-data';
import { Socket } from 'socket.io-client';
import { CreateGameService } from './create-game.service';
import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';
import { StartUpGameService } from './start-up-game.service';

describe('StartUpGameService', () => {
    const testGameName = 'Test Game';
    let testGameInfo: PopUpData = {
        nameGame: '',
        classicFlag: true,
        multiFlag: true,
        joinFlag: false,
        createFlag: true,
        isPlayerWaiting: true,
        username: '',
        didHostChoseAnotherFlag: false,
        message: '',
        winFlag: false,
        gameMode: '',
    };
    const routerSpy = { navigate: jasmine.createSpy('navigate') };
    let startUpGameService: StartUpGameService;
    let createGameService: CreateGameService;
    let joinGameService: JoinGameService;
    let socketService: SocketClientService;
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: Router, useValue: routerSpy }],
        });
        testGameInfo = {
            nameGame: '',
            classicFlag: true,
            multiFlag: true,
            joinFlag: false,
            createFlag: true,
            isPlayerWaiting: true,
            username: '',
            didHostChoseAnotherFlag: false,
            message: '',
            winFlag: false,
            gameMode: '',
        };
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

    it('startUpWaitingLine() should call startUpClassicWaitingLine(), multiplayerClassicGame() and joinGame() if its a classic multiplayer game and there is already a creator', () => {
        const startUpClassicWaitingLineSpy = spyOn(startUpGameService, <any>'startUpClassicWaitingLine').and.callThrough();
        const multiplayerClassicGameSpy = spyOn(startUpGameService, <any>'multiplayerClassicGame').and.callThrough();
        const joinGameSpy = spyOn(joinGameService, 'joinGame').and.callFake(() => {});
        startUpGameService['startUpWaitingLine'](testGameInfo);
        expect(startUpClassicWaitingLineSpy).toHaveBeenCalled();
        expect(multiplayerClassicGameSpy).toHaveBeenCalled();
        expect(joinGameSpy).toHaveBeenCalled();
    });

    it('startUpWaitingLine() should call startUpClassicWaitingLine(), multiplayerClassicGame() and createGame() if its a classic multiplayer game and there is not a creator', () => {
        const startUpClassicWaitingLineSpy = spyOn(startUpGameService, <any>'startUpClassicWaitingLine').and.callThrough();
        const multiplayerClassicGameSpy = spyOn(startUpGameService, <any>'multiplayerClassicGame').and.callThrough();
        const createGameSpy = spyOn(createGameService, 'createGame').and.callFake(() => {});
        testGameInfo.isPlayerWaiting = false;
        startUpGameService['startUpWaitingLine'](testGameInfo);
        expect(startUpClassicWaitingLineSpy).toHaveBeenCalled();
        expect(multiplayerClassicGameSpy).toHaveBeenCalled();
        expect(createGameSpy).toHaveBeenCalled();
    });

    it('startUpWaitingLine() should call startUpClassicWaitingLine(), soloClassicGameInfo() and send() if its a classic solo game', () => {
        const startUpClassicWaitingLineSpy = spyOn(startUpGameService, <any>'startUpClassicWaitingLine').and.callThrough();
        const soloClassicGameSpy = spyOn(startUpGameService, <any>'soloClassicGame').and.callThrough();
        const socketServiceSpy = spyOn(socketService, 'send').and.callFake(() => {});
        testGameInfo.multiFlag = false;
        startUpGameService['startUpWaitingLine'](testGameInfo);
        expect(startUpClassicWaitingLineSpy).toHaveBeenCalled();
        expect(soloClassicGameSpy).toHaveBeenCalled();
        expect(socketServiceSpy).toHaveBeenCalled();
    });

    it('startUpWaitingLine() should call startUpLimitedTimeWaitingLine() and createLimitedTimeGame() if its a limited time multiplayer game', () => {
        const startUpLimitedTimeWaitingLineSpy = spyOn(startUpGameService, <any>'startUpLimitedTimeWaitingLine').and.callThrough();
        const createLimitedTimeGameSpy = spyOn(createGameService, 'createLimitedTimeGame').and.callFake(() => {});
        testGameInfo.classicFlag = false;
        testGameInfo.multiFlag = true;
        startUpGameService['startUpWaitingLine'](testGameInfo);
        expect(startUpLimitedTimeWaitingLineSpy).toHaveBeenCalled();
        expect(createLimitedTimeGameSpy).toHaveBeenCalled();
    });

    it('soloLimitedTimeGame() should call the send() with solo limited time mode', () => {
        const socketServiceSpy = spyOn(socketService, 'send').and.callFake(() => {});
        startUpGameService['soloLimitedTimeGame']();
        expect(socketServiceSpy).toHaveBeenCalledWith('solo limited time mode');
    });

    it('declineAdversary() should call send', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService.declineAdversary(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('sendUsername() should call send', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService.sendUsername(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('startMatch() should call send()', () => {
        const spy = spyOn(socketService, 'send').and.callThrough();
        startUpGameService.startMatch(testGameName);
        expect(spy).toHaveBeenCalled();
    });

    it('startMatch() should navigate to the right URL', () => {
        startUpGameService.startMatch(testGameName);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/game']);
    });
});
