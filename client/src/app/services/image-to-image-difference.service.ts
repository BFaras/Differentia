import { Injectable } from '@angular/core';
import { ImageDataToCompare } from '@app/classes/differences-classes/image-data-to-compare';
import { DifferenceDetectorService } from './difference-detector-feature/difference-detector.service';
import { DifferenceImageGeneratorService } from './difference-detector-feature/difference-image-generator.service';

@Injectable({
  providedIn: 'root'
})
export class ImageToImageDifferenceService {

  readonly originalImage: HTMLImageElement = new Image();
  readonly modifiedImage: HTMLImageElement = new Image();
  readonly finalDifferencesImage: HTMLImageElement = new Image();

  constructor(public differenceDetector: DifferenceDetectorService) { }
  
  getModifiedImage(){
    return this.modifiedImage
  }

  getOriginialImage(){
    return this.originalImage
  }
getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): Uint8ClampedArray {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, image.width, image.height).data;
    }

    adaptCanvasSizeToImage(canvas: HTMLCanvasElement, image: HTMLImageElement): HTMLCanvasElement {
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas;
    }

    generateImagesDataToCompare(mainCanvas: HTMLCanvasElement): ImageDataToCompare {
        const canvasOriginal = this.adaptCanvasSizeToImage(mainCanvas, this.originalImage);
        const canvasOriginalData = this.getImageData(this.originalImage, canvasOriginal);
        const canvasModified = this.adaptCanvasSizeToImage(mainCanvas, this.modifiedImage);
        const canvasModifiedData = this.getImageData(this.modifiedImage, canvasModified);

        const datas: ImageDataToCompare = {
            originalImageData: canvasOriginalData,
            modifiedImageData: canvasModifiedData,
            imageHeight: this.originalImage.height,
            imageWidth: this.originalImage.width,
        };

        return datas;
    }

    generateDifferencesImage(mainCanvas: HTMLCanvasElement, differencesImageToPutDataIn: HTMLImageElement) {
        const canvasResult = this.adaptCanvasSizeToImage(mainCanvas, this.originalImage);
        const canvasResultContext: CanvasRenderingContext2D = canvasResult.getContext('2d')!;
        const differentPixelsPositionArray = this.differenceDetector.getDifferentPixelsArrayWithOffset();
        const imageGenerator = new DifferenceImageGeneratorService(mainCanvas);
        let resultImageData: ImageData;

        imageGenerator.generateImageFromPixelsDataArray(differentPixelsPositionArray);
        resultImageData = imageGenerator.getGeneratedImageData();

        canvasResultContext.putImageData(resultImageData, 0, 0);
        console.log(1)
        differencesImageToPutDataIn.src = canvasResult.toDataURL();
    }

    async waitForOriginalImageToLoad() {
        return new Promise((resolve, reject) => {
            this.originalImage.onload = () => resolve(this.originalImage);
            this.originalImage.onerror = reject;
        });
    }

    async waitForModifiedImageToLoad() {
        return new Promise((resolve, reject) => {
            this.modifiedImage.onload = () => resolve(this.modifiedImage);
            this.modifiedImage.onerror = reject;
        });
    }
  
}
