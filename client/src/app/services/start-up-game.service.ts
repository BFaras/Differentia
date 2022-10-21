import { Injectable } from '@angular/core';
// import { CreateGameService } from './create-game.service';
// import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class StartUpGameService {

  constructor(
    // private createGameService: CreateGameService,
    // private joinGameService: JoinGameService,
    private socketService: SocketClientService
    ) {}

  public isItMultiplayer(gameInfo: any): void {
    if(gameInfo.multiFlag) this.socketService.send('game page', gameInfo.namegame);
  }

  public sendUsername(username: string): void {
    this.socketService.send('username is', username);
  }

  public startUpGame(): void {

  }
}
