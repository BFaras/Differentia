import { Canvas } from 'canvas';

const NB_BIT_PER_PIXEL = 4;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

const BLACK = 0;
const ALPHA_OPAQUE = 1;

export class DifferencesImageGenerator {
    private whiteImageData;
    private offset: number;
    private readonly imageWidth: number;
    private readonly imageHeight: number;

    constructor(private offsetSent: number, private imageWidthSent: number, private imageHeightSent: number) {
        this.offset = offsetSent;
        this.imageWidth = imageWidthSent;
        this.imageHeight = imageHeightSent;
        const whiteCanvas = new Canvas(this.imageWidth, this.imageHeight);
        const whiteImageContext = whiteCanvas.getContext('2d');
        whiteImageContext.fillStyle = 'white';
        whiteImageContext.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);

        this.whiteImageData = whiteImageContext.getImageData(0, 0, whiteCanvas.width, whiteCanvas.height);
    }

    getWhiteImageData() {
        return this.whiteImageData;
    }

    addDifferencePixelsToImage(pixelPosition: number) {
        this.generateBlackPixel(pixelPosition);
        this.generateOffsetPixels(pixelPosition);
    }

    private generateOffsetPixels(centerPixelPosition: number) {
        // TD : Fonction qui dessine le offset autour du point
        //On génère un cercle autour du pixel au centre
        //Formule : (x – h)2+ (y – k)2 = r2
        //h = centre du cercle en X (ligne) et k = centre du cercle en Y (colonne)
        //r = rayon du cercle
        const centerPixelNumber = centerPixelPosition % NB_BIT_PER_PIXEL;
        const centerPixelLine = centerPixelNumber % this.imageHeight;
        const centerPixelColumn = centerPixelNumber % this.imageWidth;

        for (let i = centerPixelColumn - this.offsetSent; i < centerPixelColumn + this.offsetSent; i++) {
            for (let j = centerPixelLine; (j - centerPixelLine) ** 2 + (i - centerPixelColumn) ** 2 <= this.offsetSent ** 2; j--) {
                // in the circle
            }
            for (let j = centerPixelLine + 1; (j - centerPixelLine) ** 2 + (i - centerPixelColumn) ** 2 <= this.offsetSent ** 2; j++) {
                // in the circle
            }
        }
    }

    private generateBlackPixel(pixelPosition: number) {
        this.whiteImageData.data[pixelPosition + RED_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + GREEN_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + BLUE_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + ALPHA_POS] = ALPHA_OPAQUE;
    }
}