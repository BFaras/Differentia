import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  cancelDrawingHistory:ImageData[][] = [[],[]]
  undoCancelDrawingHistory:ImageData[][] = [[],[]]
  context:CanvasRenderingContext2D;
  index:number;

  constructor() { }

  setCanvasIndex(index:number){
    this.index = index;
  }
  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context
    let imageData = context.getImageData(0,0,640,480);
    this.cancelDrawingHistory[this.index].push(imageData)
  }

  cancelCanvas(){
    if(this.cancelDrawingHistory[this.index].length!= 0){
    let imageDataToPop = this.cancelDrawingHistory[this.index].pop() as ImageData
    this.context.putImageData(imageDataToPop, 0, 0);
    this.saveDeletedCanvas(imageDataToPop)
    }
  }

  saveDeletedCanvas(imageDeleted:ImageData){
    this.undoCancelDrawingHistory[this.index].push(imageDeleted);


  }

  cancelDeletedCanvas(){
    if(this.undoCancelDrawingHistory[this.index].length != 0 ){
    let DeletedImageDataToPop = this.undoCancelDrawingHistory[this.index].pop() as ImageData
    this.context.putImageData(DeletedImageDataToPop, 0, 0);
    this.cancelDrawingHistory[this.index].push(DeletedImageDataToPop)
    }

  }

}
