import { Injectable } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { DrawingHistoryService } from './drawing-history.service';

@Injectable({
  providedIn: 'root'
})
export class CanvasDataHandlerService {
  context:CanvasRenderingContext2D[] = [];
  constructor(private drawingHistoryService: DrawingHistoryService ) { }

  setContext(context:CanvasRenderingContext2D,index:number){
    this.context![index] = context;
    this.context![index].canvas
  }

  clearCanvas(indexContext:number){
    this.context[indexContext].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT);
  }

  copyOtherCanvas(indexContext:number){
    this.drawingHistoryService.saveCanvas(this.context[indexContext],indexContext)
    if (indexContext == 0){
      const canvasOfContext = this.context[1].canvas;
      this.context[0].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
      this.context[0].drawImage(canvasOfContext,0,0);
    } else 
    if (indexContext == 1){
      const canvasOfContext = this.context[0].canvas;
      this.context[1].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
      this.context[1].drawImage(canvasOfContext,0,0);
    }

  }

  shareDataWithOtherCanvas(indexContext:number){
    if (indexContext == 0){
      const canvasOfContext = this.context[0].canvas;
      this.drawingHistoryService.saveCanvas(this.context[1],1)
      this.context[1].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
      this.context[1].drawImage(canvasOfContext,0,0);
    } else 
    if (indexContext == 1){
      const canvasOfContext = this.context[1].canvas;
      this.drawingHistoryService.saveCanvas(this.context[0],0)
      this.context[0].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
      this.context[0].drawImage(canvasOfContext,0,0);
    }
  }

}
