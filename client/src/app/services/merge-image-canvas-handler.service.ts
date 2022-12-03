import { Injectable } from '@angular/core';
import { IMAGE_HEIGHT, IMAGE_WIDTH, MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class MergeImageCanvasHandlerService {
    private canvas: HTMLCanvasElement[];
    private context: CanvasRenderingContext2D[] | null;
    private formerCanvas: HTMLCanvasElement[];
    private imageDownloaded: HTMLImageElement[];
    constructor() {
        this.canvas = [];
        this.formerCanvas = [];
        this.context = [];
        this.imageDownloaded = [new Image(), new Image()];
    }

    resetAllCanvas() {
        this.canvas = [];
        this.context = [];
        this.imageDownloaded = [new Image(), new Image()];
        this.formerCanvas = [];
    }

    setLeftContextAndCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context!.push(context);
        this.canvas.push(canvas);
    }

    setRightContextAndCanvas(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        this.context!.push(context);
        this.canvas.push(canvas);
    }

    async initializeImage(url: string, index: number) {
        this.imageDownloaded[index].src = url;
        console.log(this.imageDownloaded[index].src);
        await this.waitForImageToLoad(this.imageDownloaded[index]);
    }

    async waitForImageToLoad(imageToLoad: HTMLImageElement) {
        return new Promise((resolve, reject) => {
            imageToLoad.onload = () => resolve(imageToLoad);
            imageToLoad.onerror = (error) => reject(console.log(error));
        });
    }

    cloneCanvas(oldCanvas: HTMLCanvasElement) {
        const newCanvas = document.createElement('canvas');
        const context = newCanvas.getContext('2d');

        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;

        context!.drawImage(oldCanvas, 0, 0);

        return newCanvas;
    }

    resetCanvas() {
        this.context![ORIGINAL_IMAGE_POSITION].clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.context![MODIFIED_IMAGE_POSITION].clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
    }

    async drawImageOnCanvas(index: number) {
        this.formerCanvas[index] = this.cloneCanvas(this.canvas[index]);
        this.context![index].globalCompositeOperation = 'source-over';
        this.context![index].drawImage(this.imageDownloaded[index], 0, 0);
        this.context![index].drawImage(this.formerCanvas[index], 0, 0);
    }

    obtainUrlForMerged(index: number) {
        return this.canvas[index].toDataURL();
    }
}
