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
    this.socketService.send('solo classic mode', gameName);
  }

  // private sendUsername(username: string): void {
  //   this.socketService.send('username is', username);
  // }

  public startUpWaitingLine(gameInfo: any, username: string): void {
    if(gameInfo.multiFlag) {
      this.multiplayerGame(gameInfo, username);
    }
    else {
      this.soloGame(gameInfo.nameGame);
    }
  }

  public startMatch(gameName: string) {
    this.socketService.send('launch classic mode multiplayer match', gameName);
  }

  public declineAdversary(gameName: string) {
    this.socketService.send('I refuse this adversary', gameName);
  }

  public sendUsername(username: string): void {
    console.log("send username");
    this.socketService.send('my username is', username);
  }

}
