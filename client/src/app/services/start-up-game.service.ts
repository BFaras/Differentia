import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreateGameService } from './create-game.service';
import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class StartUpGameService {
    constructor(
        private createGameService: CreateGameService,
        private joinGameService: JoinGameService,
        private socketService: SocketClientService,
        private router: Router,
    ) {}

    startUpWaitingLine(gameInfo: any): void {
        if (gameInfo.classicFlag) {
            this.startUpClassicWaitingLine(gameInfo);
        } else {
            this.startUpLimitedTimeWaitingLine(gameInfo);
        }
    }

    startMatch(gameName: string) {
        this.socketService.send('launch classic mode multiplayer match', gameName);
        this.router.navigate(['/game']);
    }
    
    declineAdversary(gameName: string) {
        this.socketService.send('I refuse this adversary', gameName);
    }
    
    sendUsername(username: string): void {
        this.socketService.send('my username is', username);
    }

    // pt les 2 ifs dans les 2 prochaines fonctions peuvent etre mises dans une autre fonction?? esq c de la duplication de code????
    private startUpLimitedTimeWaitingLine(): void {
        this.createGameService.createLimitedTimeGame();
    }

    private startUpClassicWaitingLine(gameInfo: any): void {
        if (gameInfo.multiFlag) {
            this.multiplayerClassicGame(gameInfo);
        } else {
            this.soloClassicGame(gameInfo.nameGame);
        }
    }
    
    // private multiplayerLimitedTimeGame(): void {
    //     this.createGameService.createLimitedTimeGame();
    // }
    
    // private soloLimitedTimeGame(): void {
    //     this.socketService.send('solo limited time mode'); // À gérer dans socket Manager
    // }

    private multiplayerClassicGame(gameInfo: any): void {
        if (gameInfo.isPlayerWaiting) this.joinGameService.joinGame(gameInfo.nameGame);
        else this.createGameService.createGame(gameInfo.nameGame);
    }
    
    private soloClassicGame(gameName: string): void {
        this.socketService.send('solo classic mode', gameName);
    }
}
