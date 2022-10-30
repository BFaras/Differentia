import { Injectable } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';

@Injectable({
  providedIn: 'root'
})
export class CanvasDataHandlerService {
  context:CanvasRenderingContext2D[] = [];
  constructor() { }

  setContext(context:CanvasRenderingContext2D,index:number){
    this.context![index] = context;
    this.context![index].canvas
  }

  clearCanvas(indexContext:number){
    this.context[indexContext].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT);
  }

  copyOtherCanvas(indexContext:number){
    if (indexContext == 0){
      const canvasOfContext = this.context[1].canvas;
      this.context[0].drawImage(canvasOfContext,0,0);
    } else 
    if (indexContext == 1){
      const canvasOfContext = this.context[0].canvas;
      this.context[1].drawImage(canvasOfContext,0,0);
    }

  }

  shareDataWithOtherCanvas(indexContext:number){
    if (indexContext == 0){
      const canvasOfContext = this.context[0].canvas;
      this.context[1].drawImage(canvasOfContext,0,0);
    } else 
    if (indexContext == 1){
      const canvasOfContext = this.context[1].canvas;
      this.context[0].drawImage(canvasOfContext,0,0);
    }
  }

}
