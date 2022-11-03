import { Injectable } from '@angular/core';

const ROUND_LINE_CAP:CanvasLineCap = "round";
const SQUARE_LINE_CAP:CanvasLineCap = "square";
const WRITE_MODE:string = "write";
const ERASE_MODE:string = "erase";
@Injectable({
  providedIn: 'root'
})
export class PencilService {
  private leftCanvasWidth:number;
  private leftCanvasColor:string;
  private RightCanvasWidth:number;
  private RightCanvasColor:string;
  private pencilMode:string[];

  constructor() {
    this.pencilMode = [];
   }

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
    if(this.pencilMode[indexCanvas] == WRITE_MODE){
      return ROUND_LINE_CAP
    }

    else if(this.pencilMode[indexCanvas] == ERASE_MODE){
      return SQUARE_LINE_CAP
    }
    return
    
  }

  setStateOfPencilForRightCanvas(pencilMode:string,indexCanvas:number){
    this.pencilMode[indexCanvas] = pencilMode;
  }

  getStateOfPencil(context:CanvasRenderingContext2D,indexCanvas:number){
    if(this.pencilMode[indexCanvas] == ERASE_MODE)
      context.globalCompositeOperation = "destination-out";
    if (this.pencilMode[indexCanvas] == WRITE_MODE){
      context.globalCompositeOperation = "source-over";
    }
  }

}
