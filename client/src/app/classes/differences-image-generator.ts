import { Canvas } from 'canvas';

const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

const BLACK = 0;
const ALPHA_OPAQUE = 1;

export class DifferencesImageGenerator {
    private whiteImageData;
    private offset : number;

    getWhiteImageData()
    {
        return this.whiteImageData;
    }

    constructor(private offsetSent : number, private canvasWidth : number, private canvasHeight : number) {
        this.offset = offsetSent;
        const whiteCanvas = new Canvas(canvasWidth, canvasHeight);
        const whiteImageContext = whiteCanvas.getContext('2d');
        whiteImageContext.fillStyle = 'white';
        whiteImageContext.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);

        this.whiteImageData = whiteImageContext.getImageData(0, 0, whiteCanvas.width, whiteCanvas.height);
    }

    addDifferencePixelsToImage(pixelPosition: number) {
        this.generateBlackPixel(pixelPosition);
        this.generateOffsetPixels(pixelPosition);
    }

    private generateOffsetPixels(centerPixelPosition: number)
    {

    }

    private generateBlackPixel(pixelPosition: number)
    {
        this.whiteImageData.data[pixelPosition + RED_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + GREEN_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + BLUE_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + ALPHA_POS] = ALPHA_OPAQUE;
    }
}