import { Injectable } from '@angular/core';

const ROUND_LINE_CAP:CanvasLineCap = "round";
const SQUARE_LINE_CAP:CanvasLineCap = "square"
@Injectable({
  providedIn: 'root'
})
export class PencilService {
  width:number;
  color:string;

  getColor():string{
    return this.color
  }

  setColor(color:string):void{
    this.color = color;

  }

  setWidth(width:number):void{
    this.width = width
  }

  getWidth():number{
    return this.width
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

  getStateOfPencil(mouseClick:MouseEvent,formerStyle:string):string{
    if(mouseClick.which === 3)
    return '#fff';
    if (mouseClick.which === 1)
    return formerStyle;
    else return formerStyle
  }
  

  constructor() { }
}
