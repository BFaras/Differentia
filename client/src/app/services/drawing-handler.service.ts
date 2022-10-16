import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrawingHandlerService {
  private canvas: HTMLCanvasElement
  mouseDownObservable:Observable<any>
  mouseMoveObservable:Observable<any>
  mouseUpObservable:Observable<any> 
  mouseLeaveObservable:Observable<any> 
  constructor() { }

  setCanvas(canvas: HTMLCanvasElement){
    this.canvas = canvas
  }

  setAllObservables():void{
    this.mouseDownObservable = fromEvent( this.getCanvas(),'mousedown');
    this.mouseMoveObservable = fromEvent( this.getCanvas(),'mousemove');
    this.mouseUpObservable = fromEvent( this.getCanvas(),'mouseup');
    this.mouseLeaveObservable = fromEvent( this.getCanvas(),'mouseleave');
  }

  getCanvas():HTMLCanvasElement{
    return this.canvas;
  }

  stopObservingMousePath(){
    return this.mouseMoveObservable.pipe(
      takeUntil(this.mouseUpObservable),
      takeUntil(this.mouseLeaveObservable),
      pairwise())
  }

  startObservingMousePath() {
    return this.mouseDownObservable
      .pipe(
        switchMap((e) => {
          return  this.stopObservingMousePath();
        })
      )
  }

  drawOnCanvas(
    prevPos: { x: number; y: number },
    currentPos: { x: number; y: number },
    cx: CanvasRenderingContext2D 
  ) {
    if (cx != null) {
    cx.beginPath();
    cx.moveTo(prevPos.x, prevPos.y);
    cx.lineTo(currentPos.x, currentPos.y);
    cx.stroke();
    }
  }


}
