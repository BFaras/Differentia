import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Coordinate } from '@app/interfaces/coordinate';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
@Component({
  selector: 'app-canvas-drawing',
  templateUrl: './canvas-drawing.component.html',
  styleUrls: ['./canvas-drawing.component.scss'],
})
export class CanvasDrawingComponent implements  AfterViewInit {
  @ViewChild('canvas') public canvasDOM: ElementRef<HTMLCanvasElement>;
  private canvas: HTMLCanvasElement
  private cx: CanvasRenderingContext2D | null;

  constructor(private drawingHandlerService:DrawingHandlerService) { }

  public ngAfterViewInit() {
    this.canvas = this.canvasDOM.nativeElement;
    this.cx = this.canvas.getContext('2d');

    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = IMAGE_HEIGHT;
    if (this.cx != null) {
      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000000';
      this.drawingHandlerService.setCanvas(this.canvas);

      this.drawingHandlerService.setAllObservables();
      this.prepareCanvasDrawing();
    }
  }

  prepareCanvasDrawing() {
    this.drawingHandlerService.startObservingMousePath()
      .subscribe((res: any) => {
        const canvas = this.canvas.getBoundingClientRect();

        const previousCoordinate:Coordinate= {
          x: res[0].clientX - canvas.left,
          y: res[0].clientY - canvas.top,
        };

        const actualCoordinate:Coordinate =  {
          x: res[1].clientX - canvas.left,
          y: res[1].clientY - canvas.top,
        };

        this.drawingHandlerService.drawOnCanvas(previousCoordinate, actualCoordinate,this.cx!);
      });
  }
}
