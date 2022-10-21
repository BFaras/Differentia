import { Injectable } from '@angular/core';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class CreateGameService {

  constructor(private socketService: SocketClientService) { }

  getStatusOnWaitingPlayer() {
    this.socketService.send("is there someone waiting");
  }


}
