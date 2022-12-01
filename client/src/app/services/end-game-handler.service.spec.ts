import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import {
    CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE,
    CLASSIC_MULTIPLAYER_LOST_MESSAGE,
    CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE,
    LOSING_FLAG,
    NO_AVAILABLE,
    WIN_FLAG,
} from '@app/const/client-consts';
import { EndGameInformations } from '@common/end-game-informations';

import { Socket } from 'socket.io-client';
import { EndGameHandlerService } from './end-game-handler.service';
import { SocketClientService } from './socket-client.service';
import SpyObj = jasmine.SpyObj;

describe('EndGameHandlerService', () => {
    let matDialogSpy: SpyObj<MatDialog>;
    let service: EndGameHandlerService;
    let socketClientService: SocketClientService;
    let socketTestHelper: SocketTestHelper;

    let endGameInfos: EndGameInformations;

    beforeEach(() => {
        socketTestHelper = new SocketTestHelper();
        socketClientService = new SocketClientService();
        socketClientService.socket = socketTestHelper as unknown as Socket;
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: SocketClientService, useValue: socketClientService },
            ],
        });
        service = TestBed.inject(EndGameHandlerService);
        service.configureSocket();
    });

    it('should open dialog', () => {
        service['openEndGameDialog']('Hello', false);
        expect(matDialogSpy).toBeTruthy();
    });

    // A verifier
    it('should open end game Dialog ', () => {
        endGameInfos = {
            isMultiplayer: false,
            isAbandon: false,
            isGameWon: true,
            hasNewRecord: true,
            playerRanking: NO_AVAILABLE,
        };
        const spy = spyOn(service, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);

        expect(spy).toHaveBeenCalled();
    });

    // A verifier
    it('should call end game event when the user win', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: false,
            isGameWon: true,
            hasNewRecord: true,
            playerRanking: NO_AVAILABLE,
        };
        const spy = spyOn(service, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE, WIN_FLAG);
    });

    // A verifier
    it('should call end game event when the user abandon', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: true,
            isGameWon: false,
            hasNewRecord: true,
            playerRanking: NO_AVAILABLE,
        };
        const spy = spyOn(service, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE, WIN_FLAG);
    });

    // A verifier
    it('should call end game event when the user lose', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: false,
            isGameWon: false,
            hasNewRecord: true,
            playerRanking: NO_AVAILABLE,
        };
        const spy = spyOn(service, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_LOST_MESSAGE, LOSING_FLAG);
    });
});
