const NB_BIT_PER_PIXEL = 4;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

const BLACK = 0;
const ALPHA_OPAQUE = 255;

export class DifferencesImageGenerator {
    private generatedImageData;

    constructor(private readonly canvasToDrawOn: HTMLCanvasElement) {
        const whiteImageContext: CanvasRenderingContext2D = this.canvasToDrawOn.getContext('2d')!;
        //whiteImageContext!.fillStyle = 'white';
        whiteImageContext!.fillStyle = `rgb(
            245,
            245,
            245)`;
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
        this.generatedImageData.data[pixelPositionInDataArray + RED_POS] = BLACK;
        this.generatedImageData.data[pixelPositionInDataArray + GREEN_POS] = BLACK;
        this.generatedImageData.data[pixelPositionInDataArray + BLUE_POS] = BLACK;
        this.generatedImageData.data[pixelPositionInDataArray + ALPHA_POS] = ALPHA_OPAQUE;
    }
}
