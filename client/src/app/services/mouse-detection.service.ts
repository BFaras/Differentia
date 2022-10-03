import { Injectable } from '@angular/core';
import { MouseButton } from '@common/mouseButton';
import { Position } from '@common/position';
import { DrawService } from './draw.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
  providedIn: 'root'
})
export class MouseDetectionService {

  constructor(public socketService: SocketClientService, private drawService: DrawService) { }
  mousePosition: Position = { x: 0, y: 0 };

  mouseHitDetect(event: MouseEvent){
    if (event.button === MouseButton.Left) {
      this.mousePosition = { x: event.offsetX, y: event.offsetY };
      console.log('mouseHit');
      this.socketService.send("Verify position", this.mousePosition);
    }
  }

  getPosition(mousePosition:Position){return mousePosition;}

  playSound(differenceIsValid:boolean){
      let audio = new Audio();
      if (differenceIsValid) audio.src ="../../assets/sounds/validSound.mp3";
      else audio.src ="../../assets/sounds/invalidSound.mp3";
      audio.load();
      audio.play();
  }

  clickMessage(differenceIsValid:boolean){
    let message: string = '';
    if (differenceIsValid) message = "GOOD JOB";
    else message ="ERROR";
    this.drawService.drawWord(message, this.mousePosition);
    console.log('draw');
  }
}
