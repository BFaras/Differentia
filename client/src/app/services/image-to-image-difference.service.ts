import { Injectable } from '@angular/core';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { ImageGeneratorService } from './difference-detector-feature/image-generator.service';

@Injectable({
    providedIn: 'root',
})
export class ImageToImageDifferenceService {
    private originalImage: HTMLImageElement = new Image();
    private modifiedImage: HTMLImageElement = new Image();
    private mainCanvas: HTMLCanvasElement;

    constructor(private imageGeneratorService: ImageGeneratorService) {}

    getImagesData(mainCanvas: HTMLCanvasElement, originalImage: HTMLImageElement, modifiedImage: HTMLImageElement, offSet: number) {
        this.setupDataInService(mainCanvas, originalImage, modifiedImage);
        return this.generateImagesDataToCompare(offSet);
    }

    putDifferencesDataInImage(differentPixelsPositionArray: number[], differencesImageToPutDataIn: HTMLImageElement) {
        const canvasResult = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasResultContext: CanvasRenderingContext2D = canvasResult.getContext('2d')!;
        const resultImageData: ImageData = this.imageGeneratorService.generateImageFromPixelsDataArray(differentPixelsPositionArray, this.mainCanvas);

        canvasResultContext.putImageData(resultImageData, 0, 0);
        differencesImageToPutDataIn.src = canvasResult.toDataURL();
    }

    private setupDataInService(mainCanvas: HTMLCanvasElement, originalImage: HTMLImageElement, modifiedImage: HTMLImageElement) {
        this.originalImage = originalImage;
        this.modifiedImage = modifiedImage;
        this.mainCanvas = mainCanvas;
    }

    private getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): Uint8ClampedArray {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, image.width, image.height).data;
    }

    private adaptCanvasSizeToImage(canvas: HTMLCanvasElement, image: HTMLImageElement): HTMLCanvasElement {
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas;
    }

    private generateImagesDataToCompare(offSet: number): ImageDataToCompare {
        const canvasOriginal = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasOriginalData = this.getImageData(this.originalImage, canvasOriginal);
        const canvasModified = this.adaptCanvasSizeToImage(this.mainCanvas, this.modifiedImage);
        const canvasModifiedData = this.getImageData(this.modifiedImage, canvasModified);

        const imagesdata: ImageDataToCompare = {
            originalImageData: canvasOriginalData,
            modifiedImageData: canvasModifiedData,
            imageHeight: this.originalImage.height,
            imageWidth: this.originalImage.width,
            offSet: offSet,
        };

        return imagesdata;
    }

    async waitForImageToLoad(imageToLoad: HTMLImageElement) {
        return new Promise((resolve, reject) => {
            imageToLoad.onload = () => resolve(imageToLoad);
            imageToLoad.onerror = (error) => reject(console.log(error));
        });
    }
}
