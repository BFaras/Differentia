import { Injectable } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { fromEvent, Observable } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DrawingHandlerService {
  private canvas: HTMLCanvasElement
  mouseDownObservable:Observable<MouseEvent>
  mouseMoveObservable:Observable<MouseEvent>
  mouseUpObservable:Observable<MouseEvent> 
  mouseLeaveObservable:Observable<MouseEvent> 
  constructor() { }

  setCanvas(canvas: HTMLCanvasElement){
    this.canvas = canvas
  }

  getCoordinateX(mouseEvent:MouseEvent,canvasReact:DOMRect){
    return mouseEvent.clientX - canvasReact.left
  }

  getCoordinateY(mouseEvent:MouseEvent,canvasReact:DOMRect){
    return mouseEvent.clientY - canvasReact.top
  }

  setAllObservables():void{
    this.mouseDownObservable = fromEvent( this.getCanvas(),'mousedown') as Observable<MouseEvent> ;
    this.mouseMoveObservable = fromEvent( this.getCanvas(),'mousemove')  as Observable<MouseEvent>;
    this.mouseUpObservable = fromEvent( this.getCanvas(),'mouseup')  as Observable<MouseEvent>;
    this.mouseLeaveObservable = fromEvent( this.getCanvas(),'mouseleave')  as Observable<MouseEvent>;
  }

  getCanvas():HTMLCanvasElement{
    return this.canvas;
  }

  stopObservingMousePath():Observable<[MouseEvent,MouseEvent]>{
    return this.mouseMoveObservable.pipe(
      takeUntil(this.mouseUpObservable),
      takeUntil(this.mouseLeaveObservable),
      pairwise())
  }

  startObservingMousePath():Observable<[MouseEvent,MouseEvent]> {
    return this.mouseDownObservable
      .pipe(
        switchMap(() => {
          return  this.stopObservingMousePath();
        })
      )
  }

  drawOnCanvas(
    prevCoord: Coordinate,
    currentCoord: Coordinate,
    cx: CanvasRenderingContext2D 
  ) {
      if (cx != null) {
        cx.beginPath();
        cx.moveTo(prevCoord.x, prevCoord.y);
        cx.lineTo(currentCoord.x, currentCoord.y);
        cx.stroke();
        }
  }

}
