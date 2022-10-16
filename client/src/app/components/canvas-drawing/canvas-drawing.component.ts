import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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

  public ngAfterViewInit() {
    this.canvas = this.canvasDOM.nativeElement;
    this.cx = this.canvas.getContext('2d');

    this.canvas.width = IMAGE_WIDTH;
    this.canvas.height = IMAGE_HEIGHT;
    if (this.cx != null) {
      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000000';

    }
  }

}
