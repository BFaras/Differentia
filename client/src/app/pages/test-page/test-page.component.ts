import { Component } from '@angular/core';
import { DifferencesDetector } from '@app/classes/differences-detector';
import { ImageDataToCompare } from '@app/classes/image-data-to-compare';

@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent {
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();

    constructor() {
        let diffDetector: DifferencesDetector;
        this.originalImage.src = '../../../assets/ImageBlanche.bmp';
        this.modifiedImage.src = '../../../assets/ImageDiff.bmp';

        // Eventuellement une fonction, si ca fonctionne
        const canvasOriginal = this.createNewCanvas(this.originalImage);
        const canvasOriginalData = this.getImageData(this.originalImage, canvasOriginal);

        const canvasModified = this.createNewCanvas(this.modifiedImage);
        const canvasModifiedData = this.getImageData(this.modifiedImage, canvasModified);

        const datas: ImageDataToCompare = {
            originalImageData: canvasOriginalData,
            modifiedImageData: canvasModifiedData,
            imageHeight: this.originalImage.height,
            imageWidth: this.originalImage.width,
        };

        diffDetector = new DifferencesDetector(datas, 0);

        const canvasResult = this.createNewCanvas(this.originalImage);
        const canvasResultContext: CanvasRenderingContext2D = canvasResult.getContext('2d')!;
        const resultImageData = diffDetector.differenceImageGenerator.getDifferencesImageData();

        canvasResultContext.putImageData(resultImageData, 0, 0);
        this.finalDifferencesImage;
    }

    getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): Uint8ClampedArray {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    createNewCanvas(image: HTMLImageElement): HTMLCanvasElement {
        const canvasImage = new HTMLCanvasElement();
        canvasImage.width = image.width;
        canvasImage.height = image.height;

        return canvasImage;
    }
}
