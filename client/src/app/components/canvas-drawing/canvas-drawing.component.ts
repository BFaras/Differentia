import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
import { PencilService } from '@app/services/pencil.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
@Component({
  selector: 'app-canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.scss']
})
export class CanvasDrawingComponent implements  AfterViewInit {
  @ViewChild('canvas') public canvasDOM: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D | null;

  constructor(private drawingHandlerService:DrawingHandlerService,
    private pencilService:PencilService,private drawingHistoryService:DrawingHistoryService) { }

  public ngAfterViewInit():void {
    this.canvas = this.canvasDOM.nativeElement;
    this.context = this.canvas.getContext('2d');

    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = IMAGE_HEIGHT;
    this.useCanvasFocusedOn();
    this.prepareCanvasDrawing();

  }

  allowToDrawOnCanvas(){
    this.useCanvasFocusedOn()
  }

  useCanvasFocusedOn(){
    this.drawingHandlerService.setCanvas(this.canvas);
    this.drawingHandlerService.setAllObservables();
  }

  isCanvasNotBlank() {
    return this.context!.getImageData(0, 0, this.canvas.width, this.canvas.height).data
      .some(channel => channel !== 0);
  }

  prepareCanvasDrawing():void {

    this.drawingHandlerService.mouseDownObservable.subscribe((e)=>{
        this.drawingHistoryService.saveCanvas(this.context!);
      if(this.drawingHistoryService.firstCanvasHistory[1].length != 0){
        this.drawingHistoryService.firstCanvasHistory[1] = [];
      }
  });

    this.drawingHandlerService.mouseUpObservable.subscribe((e)=>{
        this.drawingHistoryService.saveCanvas(this.context!);

    });



    this.drawingHandlerService.startObservingMousePath()
      .subscribe((mouseEvent:[MouseEvent,MouseEvent]) => {
        if (this.context != null) {
          this.context.lineWidth = this.pencilService.getWidth();
          this.context.strokeStyle = this.pencilService.getStateOfPencil(mouseEvent[0],this.pencilService.getColor());
          this.context.lineCap = this.pencilService.assignRightLineCap(mouseEvent[0])!;
        }

        const canvasReact = this.canvas.getBoundingClientRect();

        const previousCoordinate:Coordinate = {
          x: this.drawingHandlerService.getCoordinateX(mouseEvent[0],canvasReact),
          y: this.drawingHandlerService.getCoordinateY(mouseEvent[0],canvasReact),
        };

        const actualCoordinate:Coordinate =  {
          x: this.drawingHandlerService.getCoordinateX(mouseEvent[1],canvasReact),
          y: this.drawingHandlerService.getCoordinateY(mouseEvent[1],canvasReact),
        };
        
        this.drawingHandlerService.drawOnCanvas(previousCoordinate, actualCoordinate,this.context!);
        
      });
  }

}
