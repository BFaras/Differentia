import { Injectable } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { DrawingHistoryService } from './drawing-history.service';

const LEFT_CANVAS_INDEX = 0;
const RIGHT_CANVAS_INDEX = 1;
@Injectable({
  providedIn: 'root'
})
export class CanvasDataHandlerService {
  contextList:CanvasRenderingContext2D[] = [];
  canvas:HTMLCanvasElement;
  constructor(private drawingHistoryService: DrawingHistoryService ) { }

  setContext(context:CanvasRenderingContext2D,index:number){
    this.contextList![index] = context;
  }

  clearCanvas(indexContext:number){
    this.contextList[indexContext].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT);
    this.drawingHistoryService.saveCanvas(this.contextList[indexContext],indexContext)
  }
  
  drawOnCanvas(canvasToCopy:HTMLCanvasElement,canvasIndex:number){
    this.contextList[canvasIndex].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
    this.contextList[canvasIndex].drawImage(canvasToCopy,0,0);
  }

  copyCanvas(indexContext:number){
    this.drawingHistoryService.saveCanvas(this.contextList[indexContext],indexContext);
    this.obtainTheRightCanvas(indexContext);
    this.drawOnCanvas(this.canvas,indexContext);
    this.drawingHistoryService.saveCanvas(this.contextList[indexContext],indexContext);
  }

  obtainTheRightCanvas(indexContext:number){
    if (indexContext == LEFT_CANVAS_INDEX){
      this.canvas = this.contextList[RIGHT_CANVAS_INDEX].canvas;
    } else 
    if (indexContext == RIGHT_CANVAS_INDEX){
      this.canvas = this.contextList[LEFT_CANVAS_INDEX].canvas;
    }
  }
  
  shareDataWithOtherCanvas(indexContext:number){
    if (indexContext != RIGHT_CANVAS_INDEX){
      this.canvas = this.contextList[LEFT_CANVAS_INDEX].canvas;
      this.copyCanvas(RIGHT_CANVAS_INDEX);
    } 
    if (indexContext != LEFT_CANVAS_INDEX){
      this.canvas = this.contextList[RIGHT_CANVAS_INDEX].canvas;
      this.copyCanvas(LEFT_CANVAS_INDEX);
    }
  }

}
