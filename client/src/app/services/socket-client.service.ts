import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketClientService {

  socket: Socket;

  isSocketAlive() {
    return this.socket && this.socket.connected;
  }

  // La ligne 18 n'est pas couverte dans les codes car il est trop compliqué de la tester
  // Nikolay nous a dit en cours que nous ne perdrions pas de points pour sa
  connect() {
    this.socket = io(environment.serverUrl,{ transports: ['websocket'], upgrade: false });
  }

  disconnect() {
    this.socket.disconnect();
  }

  on<T>(event: string, action: (data: T) => void): void {
    this.socket.on(event, action);
  }

  send<T>(event: string, data?: T): void {
    if (data) {
      this.socket.emit(event, data);
    } else {
      this.socket.emit(event);
    }
  }

}
