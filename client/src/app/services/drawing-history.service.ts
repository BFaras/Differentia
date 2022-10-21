import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawingHistoryService {
  addedDrawings: ImageData[] = [];
  deletedDrawings: ImageData[] = [];
  context:CanvasRenderingContext2D;
  index:number;

  constructor() { }

  saveCanvas(context:CanvasRenderingContext2D){
    this.context = context
    let imageData = context.getImageData(0,0,640,480);
    this.addedDrawings.push(imageData)
    console.log("----added_drawing_history-----")
    console.log(this.addedDrawings)
  }

  cancelCanvas(){
    let imageDataToPop = this.addedDrawings.pop() as ImageData
    this.context.putImageData(imageDataToPop, 0, 0);
    this.saveDeletedCanvas(imageDataToPop)
    
  }

  saveDeletedCanvas(imageDeleted:ImageData){
    this.deletedDrawings.push(imageDeleted);
    console.log("----deleted_drawing_history")
    console.log(this.deletedDrawings)

  }

  cancelDeletedCanvas(){
    let DeletedImageDataToPop = this.deletedDrawings.pop() as ImageData
    this.context.putImageData(DeletedImageDataToPop, 0, 0);
    this.addedDrawings.push(DeletedImageDataToPop)
  }



}
