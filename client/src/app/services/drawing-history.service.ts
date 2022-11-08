import { Injectable } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class DrawingHistoryService {
    private cancelDrawingHistory: ImageData[][];
    private redoDrawingHistory: ImageData[][];
    private context: CanvasRenderingContext2D[];

    constructor() {
        this.cancelDrawingHistory = [[], []];
        this.redoDrawingHistory = [[], []];
        this.context = [];
    }

    clearHistory(){
        this.cancelDrawingHistory = [[], []];
        this.redoDrawingHistory = [[], []];
        this.context = [];
    }

    getCancelDrawingHistory() {
        return this.cancelDrawingHistory;
    }

    getRedoDrawingHistory() {
        return this.redoDrawingHistory;
    }

    saveCanvas(context: CanvasRenderingContext2D, index: number) {
        this.context[index] = context;
        let imageData = this.context[index].getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.cancelDrawingHistory[index].push(imageData);
    }

    cancelCanvas(index: number) {
        if (this.cancelDrawingHistory[index].length != 0) {
            let imageDataToPop = this.cancelDrawingHistory[index].pop() as ImageData;
            this.context[index].putImageData(imageDataToPop, 0, 0);
            this.redoDrawingHistory[index].push(imageDataToPop);
        }
    }

    redoCanvas(index: number) {
        if (this.redoDrawingHistory[index].length != 0) {
            let DeletedImageDataToPop = this.redoDrawingHistory[index].pop() as ImageData;
            this.context[index].putImageData(DeletedImageDataToPop, 0, 0);
            this.cancelDrawingHistory[index].push(DeletedImageDataToPop);
        }
    }
}
