import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  cancelDrawingHistory:ImageData[][] = [[],[]]
  undoCancelDrawingHistory:ImageData[][] = [[],[]]
  context:CanvasRenderingContext2D[] = [];

  constructor() { }

  saveCanvas(context:CanvasRenderingContext2D,index:number){
    this.context[index] = context
    let imageData = this.context[index].getImageData(0,0,640,480);
    this.cancelDrawingHistory[index].push(imageData)
  }

  cancelCanvas(index:number){
    if(this.cancelDrawingHistory[index].length!= 0){
    let imageDataToPop = this.cancelDrawingHistory[index].pop() as ImageData
    this.context[index].putImageData(imageDataToPop, 0, 0);
    this.undoCancelDrawingHistory[index].push(imageDataToPop)
    }
  }

  cancelDeletedCanvas(index:number){
    if(this.undoCancelDrawingHistory[index].length != 0 ){
    let DeletedImageDataToPop = this.undoCancelDrawingHistory[index].pop() as ImageData
    this.context[index].putImageData(DeletedImageDataToPop, 0, 0);
    this.cancelDrawingHistory[index].push(DeletedImageDataToPop)
    }

  }

}
