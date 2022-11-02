import { Injectable } from '@angular/core';

const ROUND_LINE_CAP:CanvasLineCap = "round";
const SQUARE_LINE_CAP:CanvasLineCap = "square";
@Injectable({
  providedIn: 'root'
})
export class PencilService {
  leftCanvasWidth:number;
  leftCanvasColor:string;
  RightCanvasWidth:number;
  RightCanvasColor:string;
  pencilMode:string;
  canvasId:number[] = [];

  obtainPencilColor(index:number):string{
    if(index == 0){
      return this.leftCanvasColor
    }
    else 
    {
      return this.RightCanvasColor
    }
  }

  setColor(color:string,index:number):void{
    if (index == 0)
      {
        console.log(color)
        this.leftCanvasColor = color
      }
    else if(index == 1)
      {this.RightCanvasColor = color};

  }

  setWidth(width:number,index:number):void{
    
    if (index == 0)
      {this.leftCanvasWidth = width}
    else if(index == 1)
      {this.RightCanvasWidth = width};
  }

  obtainPencilWidth(index:number):number{
    if(index == 0){
      return this.leftCanvasWidth
    }
    else 
    {
      return this.RightCanvasWidth
    }
  }

  assignRightLineCap(indexCanvas:number){
    if(this.pencilMode == "write" && indexCanvas == this.canvasId[indexCanvas]){
      console.log('round')
      return ROUND_LINE_CAP
    }

    else if(this.pencilMode == "erase" && indexCanvas == this.canvasId[indexCanvas] ){
      console.log('square')
      return SQUARE_LINE_CAP
    }
    return
    
  }

  setStateOfPencilForRightCanvas(pencilMode:string,indexCanvas:number){
    this.pencilMode = pencilMode;
    this.canvasId[indexCanvas] = indexCanvas;
  }

  getStateOfPencil(context:CanvasRenderingContext2D,indexCanvas:number){
    if(this.pencilMode == "erase" && indexCanvas == this.canvasId[indexCanvas] )
      context.globalCompositeOperation = "destination-out";
    if (this.pencilMode == "write" && indexCanvas == this.canvasId[indexCanvas]){
      context.globalCompositeOperation = "source-over";
    }
  }
  

  constructor() { }
}
