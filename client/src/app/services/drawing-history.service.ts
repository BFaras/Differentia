import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  firstCanvasHistory:ImageData[][] = [[],[]]
  secondCanvasHistory:ImageData[][] = [[],[]]
  context:CanvasRenderingContext2D;
  index:number;

  constructor() { }

  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context
    let imageData = context.getImageData(0,0,640,480);
    this.firstCanvasHistory[0].push(imageData)
    console.log(this.firstCanvasHistory[0])
  }

  cancelCanvas(){
    if(this.firstCanvasHistory[0].length!= 0){
    let imageDataToPop = this.firstCanvasHistory[0].pop() as ImageData
    this.context.putImageData(imageDataToPop, 0, 0);
    this.saveDeletedCanvas(imageDataToPop)
    }
  }

  saveDeletedCanvas(imageDeleted:ImageData){
    this.firstCanvasHistory[1].push(imageDeleted);


  }

  cancelDeletedCanvas(){
    if(this.firstCanvasHistory[1].length != 0 ){
    let DeletedImageDataToPop = this.firstCanvasHistory[1].pop() as ImageData
    this.context.putImageData(DeletedImageDataToPop, 0, 0);
    this.firstCanvasHistory[0].push(DeletedImageDataToPop)
    }
  }



}
