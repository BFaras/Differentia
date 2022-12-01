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
  leftCanvasEchange:HTMLCanvasElement;
  rightCanvasEchange:HTMLCanvasElement;
  contextLeft:CanvasRenderingContext2D;
  contextRight:CanvasRenderingContext2D;
  savedCanvas:HTMLCanvasElement;
  constructor(private drawingHistoryService: DrawingHistoryService) {
    this.leftCanvasEchange = document.createElement('canvas');
    this.leftCanvasEchange.width = 640;
    this.leftCanvasEchange.height = 480;
    this.contextLeft = this.leftCanvasEchange.getContext('2d')!;

    this.rightCanvasEchange = document.createElement('canvas');
    this.rightCanvasEchange.width = 640;
    this.rightCanvasEchange.height = 480;
    this.contextRight = this.rightCanvasEchange.getContext('2d')!;
   }

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

  exchangeCanvas(){
    this.contextLeft!.drawImage( this.contextList[0].canvas,0,0);
    this.contextRight!.drawImage(this.contextList[1].canvas,0,0)

    
    this.drawingHistoryService.saveCanvas(this.contextList[0],0);
    this.contextList[0].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
    this.contextList[0].drawImage(this.rightCanvasEchange,0,0);
    this.contextRight.clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)

    this.drawingHistoryService.saveCanvas(this.contextList[1],1);
    this.contextList[1].clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
    this.contextList[1].drawImage(this.leftCanvasEchange,0,0);
    this.contextLeft.clearRect(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
  }
  
  shareDataWithOtherCanvas(){
    this.canvas = this.contextList[LEFT_CANVAS_INDEX].canvas;
    this.exchangeCanvas();
  }
}
