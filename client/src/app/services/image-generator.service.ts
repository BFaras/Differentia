import { Injectable } from '@angular/core';
import { ALPHA_OPAQUE, ALPHA_POS, BLACK_RGB, MAX_RGB_VALUE, NB_BIT_PER_PIXEL } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class ImageGeneratorService {

    generateBlackImageFromPixelsDataArray(differentPixelsArray: number[], canvasToDrawOn: HTMLCanvasElement): ImageData {
        this.setupCanvas(canvasToDrawOn);
        const generatedImageData = canvasToDrawOn.getContext('2d')!.getImageData(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);

        for (let i = 0; i < differentPixelsArray.length; i++) {
            this.generateBlackPixel(differentPixelsArray[i] * NB_BIT_PER_PIXEL, generatedImageData);
        }

        return generatedImageData;
    }

    copyCertainPixelsFromOneImageToACanvas(
        pixelPositionsArray: number[],
        canvasToCopyFrom: HTMLCanvasElement,
        canvasToDrawOn: HTMLCanvasElement,
        invertColors?: boolean,
    ) {
        const imageToDrawOnData: ImageData = canvasToDrawOn.getContext('2d')!.getImageData(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);
        const imageToCopyData: ImageData = canvasToCopyFrom.getContext('2d')!.getImageData(0, 0, canvasToCopyFrom.width, canvasToCopyFrom.height);

        for (let pixelPosition = 0; pixelPosition < pixelPositionsArray.length; pixelPosition++) {
            this.putPixelFromOneImageToAnother(
                pixelPositionsArray[pixelPosition] * NB_BIT_PER_PIXEL,
                imageToCopyData,
                imageToDrawOnData,
                invertColors,
            );
        }

        canvasToDrawOn.getContext('2d')!.putImageData(imageToDrawOnData, 0, 0);
    }

    private setupCanvas(canvasToDrawOn: HTMLCanvasElement) {
        const whiteImageContext: CanvasRenderingContext2D = canvasToDrawOn.getContext('2d')!;
        whiteImageContext!.fillStyle = 'white';
        whiteImageContext!.fillRect(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);
    }

    private generateBlackPixel(pixelPositionInImage: number, generatedImageData: ImageData) {
        for (let currentColor = 0; currentColor < ALPHA_POS; currentColor++) {
            generatedImageData.data[pixelPositionInImage + currentColor] = BLACK_RGB;
        }
        generatedImageData.data[pixelPositionInImage + ALPHA_POS] = ALPHA_OPAQUE;
    }

    private putPixelFromOneImageToAnother(
        pixelPositionInImage: number,
        imageDataToCopy: ImageData,
        imageDataToDrawOn: ImageData,
        invertColors?: boolean,
    ) {
        for (let currentRGBIndex = 0; currentRGBIndex <= ALPHA_POS; currentRGBIndex++) {
            const positionInDataArray = pixelPositionInImage + currentRGBIndex;

            if (!invertColors || currentRGBIndex === ALPHA_POS) {
                imageDataToDrawOn.data[positionInDataArray] = imageDataToCopy.data[positionInDataArray];
            } else {
                imageDataToDrawOn.data[positionInDataArray] = MAX_RGB_VALUE - imageDataToCopy.data[positionInDataArray];
            }
        }
    }
}
