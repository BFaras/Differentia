import { Injectable } from '@angular/core';
import { ImageGeneratorService } from '@app/services/image-generator.service';
import { ImageDataToCompare } from '@common/image-data-to-compare';

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
        const resultImageData: ImageData = this.imageGeneratorService.generateBlackImageFromPixelsDataArray(
            differentPixelsPositionArray,
            this.mainCanvas,
        );

        canvasResultContext.putImageData(resultImageData, 0, 0);
        differencesImageToPutDataIn.src = canvasResult.toDataURL();
    }

    private setupDataInService(mainCanvas: HTMLCanvasElement, originalImage: HTMLImageElement, modifiedImage: HTMLImageElement) {
        this.originalImage = originalImage;
        this.modifiedImage = modifiedImage;
        this.mainCanvas = mainCanvas;
    }

    private adaptCanvasSizeToImage(canvas: HTMLCanvasElement, image: HTMLImageElement): HTMLCanvasElement {
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas;
    }

    private generateImagesDataToCompare(offSet: number): ImageDataToCompare {
        const canvasOriginal: HTMLCanvasElement = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasOriginalData: Uint8ClampedArray = this.getImageData(this.originalImage, canvasOriginal).data;
        const canvasModified: HTMLCanvasElement = this.adaptCanvasSizeToImage(this.mainCanvas, this.modifiedImage);
        const canvasModifiedData: Uint8ClampedArray = this.getImageData(this.modifiedImage, canvasModified).data;

        const imagesdata: ImageDataToCompare = {
            originalImageData: canvasOriginalData,
            modifiedImageData: canvasModifiedData,
            imageHeight: this.originalImage.height,
            imageWidth: this.originalImage.width,
            offSet,
        };

        return imagesdata;
    }

    private getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): ImageData {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, image.width, image.height);
    }

    async waitForImageToLoad(imageToLoad: HTMLImageElement) {
        return new Promise((resolve, reject) => {
            imageToLoad.onload = () => resolve(imageToLoad);
            imageToLoad.onerror = (error) => reject(console.log(error));
        });
    }
}
