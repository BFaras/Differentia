import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  cancelDrawingHistory:ImageData[][] = [[],[]]
  undoCancelDrawingCHistory:ImageData[][] = [[],[]]
  context:CanvasRenderingContext2D;
  index:number;

  constructor() { }

  setCanvasIndex(index:number){
    this.index = index;
  }
  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context
    let imageData = context.getImageData(0,0,640,480);
    this.cancelDrawingHistory[0].push(imageData)
  }

  cancelCanvas(){
    if(this.cancelDrawingHistory[0].length!= 0){
    let imageDataToPop = this.cancelDrawingHistory[0].pop() as ImageData
    this.context.putImageData(imageDataToPop, 0, 0);
    this.saveDeletedCanvas(imageDataToPop)
    }
  }

  saveDeletedCanvas(imageDeleted:ImageData){
    this.cancelDrawingHistory[1].push(imageDeleted);


  }

  cancelDeletedCanvas(){
    if(this.cancelDrawingHistory[1].length != 0 ){
    let DeletedImageDataToPop = this.cancelDrawingHistory[1].pop() as ImageData
    this.context.putImageData(DeletedImageDataToPop, 0, 0);
    this.cancelDrawingHistory[0].push(DeletedImageDataToPop)
    }

  }

}
