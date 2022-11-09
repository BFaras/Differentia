import { Injectable } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { fromEvent, Observable, Subject } from 'rxjs';
import { pairwise, switchMap, takeUntil } from 'rxjs/operators';
import { DrawingHistoryService } from './drawing-history.service';
import { PencilService } from './pencil.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingHandlerService {
    private context: CanvasRenderingContext2D;
    private mouseDownObservable: Subject<MouseEvent>;
    private mouseMoveObservable: Subject<MouseEvent>;
    private mouseUpObservable: Subject<MouseEvent>;
    private mouseLeaveObservable: Subject<MouseEvent>;
    constructor(private pencilService: PencilService, private drawingHistoryService: DrawingHistoryService) {}

    setPencilInformation(indexOfCanvas: number) {
        this.context.lineWidth = this.pencilService.obtainPencilWidth(indexOfCanvas);
        this.pencilService.getStateOfPencil(this.context!, indexOfCanvas);
        this.context.lineCap = this.pencilService.assignRightLineCap(indexOfCanvas)!;
        this.context.strokeStyle = this.pencilService.obtainPencilColor(indexOfCanvas);
    }

    setContext(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    getCoordinateX(mouseEvent: MouseEvent, canvasReact: DOMRect) {
        return mouseEvent.clientX - canvasReact.left;
    }

    getCoordinateY(mouseEvent: MouseEvent, canvasReact: DOMRect) {
        return mouseEvent.clientY - canvasReact.top;
    }

    savingProcess(indexOfCanvas:number){
        this.drawingHistoryService.saveCanvas(this.context!, indexOfCanvas);
    
        if (this.drawingHistoryService.getRedoDrawingHistory()[indexOfCanvas].length != 0) {
            this.drawingHistoryService.getRedoDrawingHistory()[indexOfCanvas] = [];
        }
    }

    saveOnMouseDown(indexOfCanvas: number) {
        this.mouseDownObservable.subscribe(() => {
            this.savingProcess(indexOfCanvas);
        });
    }

    saveOnMouseUp(indexOfCanvas: number) {
        this.mouseUpObservable.subscribe(() => {
            this.drawingHistoryService.saveCanvas(this.context!, indexOfCanvas);
        });
    }

    setAllObservables(): void {
        this.mouseDownObservable = fromEvent(this.getCanvas(), 'mousedown') as Subject<MouseEvent>;
        this.mouseMoveObservable = fromEvent(this.getCanvas(), 'mousemove') as Subject<MouseEvent>;
        this.mouseUpObservable = fromEvent(this.getCanvas(), 'mouseup') as Subject<MouseEvent>;
        this.mouseLeaveObservable = fromEvent(this.getCanvas(), 'mouseleave') as Subject<MouseEvent>;
    }

    getCanvas(): HTMLCanvasElement {
        return this.context.canvas;
    }

    stopObservingMousePath(): Observable<[MouseEvent, MouseEvent]> {
        return this.mouseMoveObservable.pipe(takeUntil(this.mouseUpObservable), takeUntil(this.mouseLeaveObservable), pairwise());
    }

    startObservingMousePath(): Observable<[MouseEvent, MouseEvent]> {
        return this.mouseDownObservable.pipe(
            switchMap(() => {
                return this.stopObservingMousePath();
            }),
        );
    }

    drawOnCanvas(prevCoord: Coordinate, currentCoord: Coordinate) {
        this.context.beginPath();
        this.context.moveTo(prevCoord.x, prevCoord.y);
        this.context.lineTo(currentCoord.x, currentCoord.y);
        this.context.stroke();
    }
}
