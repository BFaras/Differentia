import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PopUpData } from '@app/interfaces/pop-up-data';
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

    startUpWaitingLine(gameInfo: PopUpData): void {
        if (gameInfo.classicFlag) {
            this.startUpClassicWaitingLine(gameInfo);
        } else {
            this.startUpLimitedTimeWaitingLine();
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

    soloLimitedTimeGame(): void {
        this.socketService.send('solo limited time mode');
    }

    private startUpLimitedTimeWaitingLine(): void {
        this.createGameService.createLimitedTimeGame();
    }

    private startUpClassicWaitingLine(gameInfo: PopUpData): void {
        if (gameInfo.multiFlag) {
            this.multiplayerClassicGame(gameInfo);
        } else {
            this.soloClassicGame(gameInfo.nameGame);
        }
    }

    private multiplayerClassicGame(gameInfo: PopUpData): void {
        if (gameInfo.isPlayerWaiting) this.joinGameService.joinGame(gameInfo.nameGame);
        else this.createGameService.createGame(gameInfo.nameGame);
    }

    private soloClassicGame(gameName: string): void {
        this.socketService.send('solo classic mode', gameName);
    }
}
