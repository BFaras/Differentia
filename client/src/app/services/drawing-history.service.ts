import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  historyOfDrawing: ImageData[] = [];
  context:CanvasRenderingContext2D;
  index:number;

  constructor() { }

  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context
    let imageData = context.getImageData(0,0,640,480);
    this.historyOfDrawing.push(imageData)
    console.log(this.historyOfDrawing)
  }

  cancelCanvas(){
    let imagedataToPop = this.historyOfDrawing.pop() as ImageData
    this.context.putImageData(imagedataToPop, 0, 0);


  }

  saveDrawing(){
    this.context.save();
  }

  cancelDrawing(){
    this.context.restore();
  }

}
