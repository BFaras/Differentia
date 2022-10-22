import { Injectable } from '@angular/core';
import { CreateGameService } from './create-game.service';
import { JoinGameService } from './join-game.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class StartUpGameService {

  constructor(
    private createGameService: CreateGameService,
    private joinGameService: JoinGameService,
    private socketService: SocketClientService
    ) {}

  private multiplayerGame(gameInfo: any, username: string): void {
    if(gameInfo.isPlayerWaiting) this.joinGameService.joinGame(gameInfo, username);
    else this.createGameService.createGame(gameInfo.nameGame);
  }

  private soloGame(gameName: string): void {
    this.socketService.send('game page', gameName);
  }

  private sendUsername(username: string): void {
    this.socketService.send('username is', username);
  }

  public startUpWaitingLine(gameInfo: any, username: string): void {
    if(gameInfo.multiFlag) {
      this.multiplayerGame(gameInfo, username);
    }
    else {
      this.soloGame(gameInfo.nameGame);
      this.sendUsername(username);
    }
  }

  public startMatch(gameName: string) {
    this.socketService.send('launch multiplayer match', gameName);
  }

  public declineAdversary() {
    this.socketService.send('I refuse this adversary');
  }

}
