import { Injectable } from '@angular/core';
import { MouseButton } from '@app/interfaces/mouseButton';
import { Vec2 } from '@common/vec2';
import { ImageDataToCompare } from '@common/differences-classes/image-data-to-compare'

@Injectable({
  providedIn: 'root'
})
export class MouseHandlerService {

  mousePosition: Vec2;
  differencesHashmap: Map <number, number>;

  constructor(readonly imageDataToCompare: ImageDataToCompare) {
    this.mousePosition = { x: 0, y: 0 };
    this.differencesHashmap = new Map<number, number>();
  }

  mouseHitDetect(event: MouseEvent) {
    if (event.button === MouseButton.Left) {
        this.mousePosition = { x: event.offsetX, y: event.offsetY };
    }
  }

  // Sauvegarder la hashmap de diff dans le games.json
  // Par contre la méthode devrait être ici ou dans diff-detector ??
  saveHashMapInJson(){}

  loadHashMapFromJson() {}

  convertMousePositionToPixelNumber(): number {
    return ((this.mousePosition.x + 1)*this.imageDataToCompare.imageWidth
     + this.mousePosition.y - this.imageDataToCompare.imageWidth)
  }

  validateDifferencesOnClick()
}
