import { Injectable } from '@angular/core';
import { ALPHA_OPAQUE, ALPHA_POS, BLACK_RGB, BLUE_POS, GREEN_POS, NB_BIT_PER_PIXEL, RED_POS } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class ImageGeneratorService {
    private generatedImageData;

    constructor(private readonly canvasToDrawOn: HTMLCanvasElement) {
        const whiteImageContext: CanvasRenderingContext2D = this.canvasToDrawOn.getContext('2d')!;
        whiteImageContext!.fillStyle = 'white';
        whiteImageContext!.fillRect(0, 0, this.canvasToDrawOn.width, this.canvasToDrawOn.height);

        this.generatedImageData = whiteImageContext.getImageData(0, 0, this.canvasToDrawOn.width, this.canvasToDrawOn.height);
    }

    getGeneratedImageData(): ImageData {
        return this.generatedImageData;
    }

    generateImageFromPixelsDataArray(differentPixelsArray: number[]) {
        for (let i = 0; i < differentPixelsArray.length; i++) {
            this.generateBlackPixel(differentPixelsArray[i] * NB_BIT_PER_PIXEL);
        }
    }

    private generateBlackPixel(pixelPositionInDataArray: number) {
        this.generatedImageData.data[pixelPositionInDataArray + RED_POS] = BLACK_RGB;
        this.generatedImageData.data[pixelPositionInDataArray + GREEN_POS] = BLACK_RGB;
        this.generatedImageData.data[pixelPositionInDataArray + BLUE_POS] = BLACK_RGB;
        this.generatedImageData.data[pixelPositionInDataArray + ALPHA_POS] = ALPHA_OPAQUE;
    }
}
