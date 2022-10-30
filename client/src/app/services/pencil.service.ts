import { Injectable } from '@angular/core';

const ROUND_LINE_CAP:CanvasLineCap = "round";
const SQUARE_LINE_CAP:CanvasLineCap = "square"
@Injectable({
  providedIn: 'root'
})
export class PencilService {
  leftCanvasWidth:number;
  leftCanvasColor:string;
  RightCanvasWidth:number;
  RightCanvasColor:string;

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
      {this.leftCanvasColor = color}
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

  assignRightLineCap(mouseClick:MouseEvent){
    console.log(mouseClick.which)
    if(mouseClick.which === 1){
      return ROUND_LINE_CAP
    }

    if(mouseClick.which === 3){
      return SQUARE_LINE_CAP
    }
    return
  }

  getStateOfPencil(context:CanvasRenderingContext2D,mouseClick:MouseEvent){
    if(mouseClick.which === 3)
      context.globalCompositeOperation = "destination-out";
    if (mouseClick.which === 1){
      context.globalCompositeOperation = "source-over";
    }

  }
  

  constructor() { }
}
