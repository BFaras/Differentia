import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { PencilService } from '@app/services/pencil.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
@Component({
  selector: 'app-canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.scss'],
  providers: [DrawingHandlerService]
})
export class CanvasDrawingComponent implements  AfterViewInit {
  @ViewChild('canvas') public canvasDOM: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D | null;

  constructor(private drawingHandlerService:DrawingHandlerService,
    private pencilService:PencilService) { }

  public ngAfterViewInit() {
    this.canvas = this.canvasDOM.nativeElement;
    this.context = this.canvas.getContext('2d');

    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = IMAGE_HEIGHT;

      
      this.drawingHandlerService.setCanvas(this.canvas);
      this.drawingHandlerService.setAllObservables();
      this.prepareCanvasDrawing();
    
  }

  prepareCanvasDrawing() {
    this.drawingHandlerService.startObservingMousePath()
      .subscribe((res:[MouseEvent,MouseEvent]) => {
        if (this.context != null) {

          this.context.lineWidth = this.pencilService.getWidth();
          this.context.strokeStyle = this.pencilService.getStateOfPencil(res[0],this.pencilService.getColor());
        }

        const canvas = this.canvas.getBoundingClientRect();

        const previousCoordinate:Coordinate= {
          x: res[0].clientX - canvas.left,
          y: res[0].clientY - canvas.top,
        };

        const actualCoordinate:Coordinate =  {
          x: res[1].clientX - canvas.left,
          y: res[1].clientY - canvas.top,
        };

        this.drawingHandlerService.drawOnCanvas(previousCoordinate, actualCoordinate,this.context!);
      });
  }

}
