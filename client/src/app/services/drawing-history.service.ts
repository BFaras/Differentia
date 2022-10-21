import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  context:CanvasRenderingContext2D;
  index:number;
  imageData:any;

  constructor() { }

  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context
    this.imageData = context.getImageData(0,0,640,480);
  }

  cancelCanvas(){
    this.context.putImageData(this.imageData, 0, 0);

  }

  saveDrawing(){
    this.context.save();
  }

  cancelDrawing(){
    this.context.restore();
  }

}
