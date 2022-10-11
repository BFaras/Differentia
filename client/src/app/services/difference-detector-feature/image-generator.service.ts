import { Injectable } from '@angular/core';
import { ALPHA_POS, BLACK_RGB, NB_BIT_PER_PIXEL } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class ImageGeneratorService {
    constructor() {}

    generateBlackImageFromPixelsDataArray(differentPixelsArray: number[], canvasToDrawOn: HTMLCanvasElement): ImageData {
        this.setupCanvas(canvasToDrawOn);
        const generatedImageData = canvasToDrawOn.getContext('2d')!.getImageData(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);

        for (let i = 0; i < differentPixelsArray.length; i++) {
            this.generateBlackPixel(differentPixelsArray[i] * NB_BIT_PER_PIXEL, generatedImageData);
        }

        return generatedImageData;
    }

    copyCertainPixelsFromOneImageToACanvas(pixelPositionsArray: number[], canvasToGetImageData: HTMLCanvasElement, canvasToDrawOn: HTMLCanvasElement, imageToCopyFrom: HTMLImageElement)
    {
        const imageToDrawOnData: ImageData = canvasToDrawOn.getContext('2d')!.getImageData(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);
        const imageToCopyData: ImageData = this.getImageData(imageToCopyFrom, canvasToGetImageData);

        for (let pixelPosition = 0; pixelPosition < pixelPositionsArray.length; pixelPosition++) {
            this.putPixelFromOneImageToAnother(pixelPosition, imageToDrawOnData, imageToCopyData);
        }

        canvasToDrawOn.getContext('2d')!.putImageData(imageToDrawOnData, 0, 0);
    }

    getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): ImageData {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, image.width, image.height);
    }

    private setupCanvas(canvasToDrawOn: HTMLCanvasElement) {
        const whiteImageContext: CanvasRenderingContext2D = canvasToDrawOn.getContext('2d')!;
        whiteImageContext!.fillStyle = 'white';
        whiteImageContext!.fillRect(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);
    }

    private generateBlackPixel(pixelPositionInImage: number, generatedImageData: ImageData) {
        for (let currentColor = 0; currentColor <= ALPHA_POS; currentColor++)
        {
            generatedImageData.data[pixelPositionInImage + currentColor] = BLACK_RGB;
        }
    }

    private putPixelFromOneImageToAnother(pixelPositionInImage: number, imageDataToCopy: ImageData, imageDataToDrawOn: ImageData)
    {
        for (let currentRGBIndex = 0; currentRGBIndex <= ALPHA_POS; currentRGBIndex++)
        {
            const positionInDataArray = pixelPositionInImage + currentRGBIndex;
            imageDataToDrawOn.data[positionInDataArray] = imageDataToCopy.data[positionInDataArray];
        }
    }
}
