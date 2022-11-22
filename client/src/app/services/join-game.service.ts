import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class JoinGameService {
  constructor(private socketService: SocketClientService) { }

  joinGame(gameName: string) {
    console.log('I am trying to join');
    this.socketService.send('I am trying to join', gameName);
  }

  leaveJoiningProcess(gameName: string) {
    this.socketService.send('I dont want to join anymore', gameName);
    this.socketService.send('need reconnection');
  }

}
