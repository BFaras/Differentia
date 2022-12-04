import { Injectable } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { DrawingHistoryService } from './drawing-history.service';

const LEFT_CANVAS_INDEX = 0;
const RIGHT_CANVAS_INDEX = 1;
@Injectable({
    providedIn: 'root',
})
export class CanvasDataHandlerService {
    contextList: CanvasRenderingContext2D[] = [];
    canvas: HTMLCanvasElement;
    leftCanvasEchange: HTMLCanvasElement;
    rightCanvasEchange: HTMLCanvasElement;
    contextLeft: CanvasRenderingContext2D;
    contextRight: CanvasRenderingContext2D;
    savedCanvas: HTMLCanvasElement;
    constructor(private drawingHistoryService: DrawingHistoryService) {
        this.leftCanvasEchange = document.createElement('canvas');
        this.leftCanvasEchange.width = IMAGE_WIDTH;
        this.leftCanvasEchange.height = IMAGE_HEIGHT;
        this.contextLeft = this.leftCanvasEchange.getContext('2d')!;

        this.rightCanvasEchange = document.createElement('canvas');
        this.rightCanvasEchange.width = IMAGE_WIDTH;
        this.rightCanvasEchange.height = IMAGE_HEIGHT;
        this.contextRight = this.rightCanvasEchange.getContext('2d')!;
    }

    setContext(context: CanvasRenderingContext2D, index: number) {
        this.contextList![index] = context;
    }

    exchangeCanvas() {
        this.drawOnFakeCanvas();

        this.drawOnOtherCanvas(0, this.rightCanvasEchange);
        this.drawOnOtherCanvas(1, this.leftCanvasEchange);
    }

    drawOnFakeCanvas() {
        this.contextLeft!.drawImage(this.contextList[0].canvas, 0, 0);
        this.contextRight!.drawImage(this.contextList[1].canvas, 0, 0);
    }

    drawOnOtherCanvas(index: number, canvas: HTMLCanvasElement) {
        this.drawingHistoryService.saveCanvas(this.contextList[index], index);
        this.contextList[index].clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.contextList[index].drawImage(canvas, 0, 0);
        this.drawingHistoryService.saveCanvas(this.contextList[index], index);
        if (index === 1) this.contextLeft.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        else if (index === 0) this.contextRight.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    }

    shareDataWithOtherCanvas() {
        this.canvas = this.contextList[LEFT_CANVAS_INDEX].canvas;
        this.exchangeCanvas();
    }

    clearCanvas(indexContext: number) {
        this.contextList[indexContext].clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.drawingHistoryService.saveCanvas(this.contextList[indexContext], indexContext);
    }

    drawOnCanvas(canvasToCopy: HTMLCanvasElement, canvasIndex: number) {
        this.contextList[canvasIndex].clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.contextList[canvasIndex].drawImage(canvasToCopy, 0, 0);
    }

    copyCanvas(indexContext: number) {
        this.drawingHistoryService.saveCanvas(this.contextList[indexContext], indexContext);
        this.obtainTheRightCanvas(indexContext);
        this.drawOnCanvas(this.canvas, indexContext);
        this.drawingHistoryService.saveCanvas(this.contextList[indexContext], indexContext);
    }

    obtainTheRightCanvas(indexContext: number) {
        if (indexContext === LEFT_CANVAS_INDEX) {
            this.canvas = this.contextList[RIGHT_CANVAS_INDEX].canvas;
        } else if (indexContext === RIGHT_CANVAS_INDEX) {
            this.canvas = this.contextList[LEFT_CANVAS_INDEX].canvas;
        }
    }
}
