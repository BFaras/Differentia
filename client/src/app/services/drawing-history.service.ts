import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  context:CanvasRenderingContext2D;
  index:number;

  constructor() { }

  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context;
  }

  saveDrawing(){
    this.context.save();
  }

  cancelDrawing(){
    this.context.restore();
  }

}
