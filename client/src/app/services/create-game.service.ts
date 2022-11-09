import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class CreateGameService {

  constructor(private socketService: SocketClientService) { }

  public createGame(gameName: string): void {
    this.addPlayerOnWaitingList(gameName);
  }

  private addPlayerOnWaitingList(gameName: string): void {
    this.socketService.send('I am waiting', gameName);
  }

  public leaveWaitingList(gameName: string): void {
    this.socketService.send('I left', gameName);
    this.socketService.send('need reconnection');
  }

}
