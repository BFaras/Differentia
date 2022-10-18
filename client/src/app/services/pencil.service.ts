import { Injectable } from '@angular/core';

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

  getStateOfPencil(mouseClick:MouseEvent,formerStyle:string):string{
    if(mouseClick.which === 3)
    return '#fff';
    if (mouseClick.which === 1)
    return formerStyle;
    else return formerStyle
  }
  

  constructor() { }
}
