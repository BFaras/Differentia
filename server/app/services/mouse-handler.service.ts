import { Injectable } from '@angular/core';
import { MouseButton } from '@app/interfaces/mouseButton';
import { Vec2 } from '@app/interfaces/vec2';
import {DifferencesDetector} from '../diff'
@Injectable({
  providedIn: 'root'
})
export class MouseHandlerService {

  mousePosition: Vec2;

  constructor() {
    this.mousePosition = { x: 0, y: 0 };
  }

  mouseHitDetect(event: MouseEvent) {
    if (event.button === MouseButton.Left) {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
  }

  saveHashMapInJson() {

  }
  
  
}
