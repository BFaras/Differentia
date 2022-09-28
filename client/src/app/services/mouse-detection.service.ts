import { Injectable } from '@angular/core';
import { MouseButton } from '@common/mouseButton';
import { Position } from '@common/position';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class MouseDetectionService {

  constructor(public socketService: SocketClientService) { }
  mousePosition: Position = { x: 0, y: 0 };

  mouseHitDetect(event: MouseEvent){
    if (event.button === MouseButton.Left) {
      this.mousePosition = { x: event.offsetX, y: event.offsetY };
      this.socketService.send("Verify position", this.mousePosition);
      this.socketService.on("Valid click",(clickResponse:boolean)=>{
        this.playSound(clickResponse);
      });
    }
  }

  playSound(differenceIsValid:boolean){
      let audio = new Audio();
      if (differenceIsValid) audio.src ="../../assets/sounds/validSound.mp3";
      if (!differenceIsValid) audio.src ="../../assets/sounds/invalidSound.mp3";
      audio.load();
      audio.play();
  }
}
