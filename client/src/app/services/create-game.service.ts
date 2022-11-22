import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class CreateGameService {
    constructor(private socketService: SocketClientService) {}

    createLimitedTimeGame(): void {
        console.log('jte send le trying to play LM');
        this.socketService.send('I am trying to play a limited time game');
    }

    createGame(gameName: string): void {
        this.addPlayerOnWaitingList(gameName);
    }

    leaveWaitingList(gameName: string): void {
        this.socketService.send('I left', gameName);
        this.socketService.send('need reconnection');
    }

    private addPlayerOnWaitingList(gameName: string): void {
        this.socketService.send('I am waiting', gameName);
    }
}
