import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
@Component({
  selector: 'app-canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.scss']
})
export class CanvasDrawingComponent implements  AfterViewInit {
  @Input('idFromParent') indexOfCanvas: any
  @ViewChild('canvas') public canvasDOM: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D | null;

  constructor(private drawingHandlerService:DrawingHandlerService,
    private mergeImageCanvasService:MergeImageCanvasHandlerService,
    private canvasDataHandlerService:CanvasDataHandlerService,
    private keyEventHandlerService:KeyEventHandlerService) { }

  ngAfterViewInit(){
    this.canvas = this.canvasDOM.nativeElement;
    this.context = this.canvas.getContext('2d');
    this.context!.globalAlpha = 0.00;
    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = IMAGE_HEIGHT;
    this.useCanvasFocusedOn();
    this.prepareCanvasDrawing();
    this.prepareCanvasMerging()
    this.addContextToCanvasData();

  }

  saveCanvasForShortcut(){
    this.keyEventHandlerService.setIndexImageOnDrawing(this.indexOfCanvas);
  }

  addContextToCanvasData(){
    this.canvasDataHandlerService.setContext(this.context!,this.indexOfCanvas)
  }

  allowToDrawOnCanvas(){
    this.useCanvasFocusedOn()
  }

  useCanvasFocusedOn(){
    this.drawingHandlerService.setContext(this.context!);
    this.drawingHandlerService.setAllObservables();
  }

  prepareCanvasDrawing():void {
    
    this.saveOnDrawing()

    this.drawingHandlerService.startObservingMousePath()
      .subscribe((mouseEvent:[MouseEvent,MouseEvent]) => {

        this.drawingHandlerService.setPencilInformation(this.indexOfCanvas);

        const canvasReact = this.canvas.getBoundingClientRect();

        const previousCoordinate:Coordinate = {
          x: this.drawingHandlerService.getCoordinateX(mouseEvent[0],canvasReact),
          y: this.drawingHandlerService.getCoordinateY(mouseEvent[0],canvasReact),
        };

        const actualCoordinate:Coordinate =  {
          x: this.drawingHandlerService.getCoordinateX(mouseEvent[1],canvasReact),
          y: this.drawingHandlerService.getCoordinateY(mouseEvent[1],canvasReact),
        };
        
        this.drawingHandlerService.drawOnCanvas(previousCoordinate, actualCoordinate);
        
      });
  }

  saveOnDrawing(){
    this.drawingHandlerService.saveOnMouseDown(this.indexOfCanvas)
    this.drawingHandlerService.saveOnMouseUp(this.indexOfCanvas)
  }

  prepareCanvasMerging(){
    if (this.indexOfCanvas == 0){
    this.mergeImageCanvasService.setLeftContextAndCanvas(this.context!,this.canvas);
  }
  else if (this.indexOfCanvas == 1){
    this.mergeImageCanvasService.setRightContextAndCanvas(this.context!,this.canvas);
  }
}
}
