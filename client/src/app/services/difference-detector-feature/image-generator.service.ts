import { Injectable } from '@angular/core';
import { ALPHA_OPAQUE, ALPHA_POS, BLACK_RGB, BLUE_POS, GREEN_POS, NB_BIT_PER_PIXEL, RED_POS } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class ImageGeneratorService {
    constructor() {}

    generateImageFromPixelsDataArray(differentPixelsArray: number[], canvasToDrawOn: HTMLCanvasElement): ImageData {
        this.setupCanvas(canvasToDrawOn);
        const generatedImageData = canvasToDrawOn.getContext('2d')!.getImageData(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);

        for (let i = 0; i < differentPixelsArray.length; i++) {
            this.generateBlackPixel(differentPixelsArray[i] * NB_BIT_PER_PIXEL, generatedImageData);
        }

        return generatedImageData;
    }

    private setupCanvas(canvasToDrawOn: HTMLCanvasElement) {
        const whiteImageContext: CanvasRenderingContext2D = canvasToDrawOn.getContext('2d')!;
        whiteImageContext!.fillStyle = 'white';
        whiteImageContext!.fillRect(0, 0, canvasToDrawOn.width, canvasToDrawOn.height);
    }

    private generateBlackPixel(pixelPositionInDataArray: number, generatedImageData: ImageData) {
        generatedImageData.data[pixelPositionInDataArray + RED_POS] = BLACK_RGB;
        generatedImageData.data[pixelPositionInDataArray + GREEN_POS] = BLACK_RGB;
        generatedImageData.data[pixelPositionInDataArray + BLUE_POS] = BLACK_RGB;
        generatedImageData.data[pixelPositionInDataArray + ALPHA_POS] = ALPHA_OPAQUE;
    }
}
