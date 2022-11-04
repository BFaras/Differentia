import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CreateGameService } from './create-game.service';
import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';

import { StartUpGameService } from './start-up-game.service';

describe('StartUpGameService', () => {
    let service: StartUpGameService;
    let createGameService: jasmine.SpyObj<CreateGameService>;
    let joinGameService: jasmine.SpyObj<JoinGameService>;
    let socketService: jasmine.SpyObj<SocketClientService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CreateGameService, useValue: createGameService },
                { provide: JoinGameService, useValue: joinGameService },
                { provide: SocketClientService, useValue: socketService },
                { provide: Router, useValue: router },
            ],
        });
        service = TestBed.inject(StartUpGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
