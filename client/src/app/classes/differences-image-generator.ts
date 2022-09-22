import { Canvas, Image } from 'canvas';

const NB_BIT_PER_PIXEL = 4;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

const BLACK = 0;
const ALPHA_OPAQUE = 1;

export class DifferencesImageGenerator {
    private whiteImageData;
    private differentPixelsPositionsWithOffset: Map<number, boolean>;

    constructor(private readonly offset: number, private readonly imageWidth: number, private readonly imageHeight: number) {
        const whiteCanvas = new Canvas(this.imageWidth, this.imageHeight);
        const whiteImageContext = whiteCanvas.getContext('2d');
        whiteImageContext.fillStyle = 'white';
        whiteImageContext.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);

        this.whiteImageData = whiteImageContext.getImageData(0, 0, whiteCanvas.width, whiteCanvas.height);
        this.differentPixelsPositionsWithOffset = new Map<number, boolean>();
    }

    getDifferentPixelsPositionWithOffset(): Map<number, boolean> {
        return this.differentPixelsPositionsWithOffset;
    }

    getWhiteImageData() {
        return this.whiteImageData;
    }

    getDifferencesImage() : Image {
        let differencesImage : Image = new Image();
        let canvas: Canvas = document.createElement('canvas');
        let ctx : CanvasRenderingContext2D = canvas.getContext('2d');
        let newImageData = this.whiteImageData.data;
        
        canvas.width = newImageData.width;
        canvas.height = newImageData.height;
        ctx.putImageData(newImageData, 0, 0);
        differencesImage.src = canvas.toDataURL();

        return differencesImage;
    }

    generateImageFromDifferencesData(differentPixelsArray: number[]) {
        for (let i = 0; i < differentPixelsArray.length; i++) {
            this.addDifferencePixelsToImage(i);
        }
    }

    addDifferencePixelsToImage(pixelPosition: number) {
        this.markDifference(pixelPosition);
        this.generateOffsetPixels(pixelPosition);
    }

    private generateOffsetPixels(centerPixelPosition: number) {
        // TD : Fonction qui dessine le offset autour du point
        // On génère un cercle autour du pixel au centre
        // Formule : (x – h)2+ (y – k)2 = r2
        // h = centre du cercle en X (ligne) et k = centre du cercle en Y (colonne)
        // r = rayon du cercle
        const centerPixelNumber = centerPixelPosition % NB_BIT_PER_PIXEL;
        const centerPixelLine = centerPixelNumber % this.imageHeight;
        const centerPixelColumn = centerPixelNumber % this.imageWidth;

        for (let i = centerPixelColumn - this.offset; i < centerPixelColumn + this.offset; i++) {
            for (let j = centerPixelLine; (j - centerPixelLine) ** 2 + (i - centerPixelColumn) ** 2 <= this.offset ** 2; j--) {
                const currentVisitingPixelPosition = i * this.imageHeight + j * this.imageWidth;
                this.markDifference(currentVisitingPixelPosition);
            }
            for (let j = centerPixelLine + 1; (j - centerPixelLine) ** 2 + (i - centerPixelColumn) ** 2 <= this.offset ** 2; j++) {
                const currentVisitingPixelPosition = i * this.imageHeight + j * this.imageWidth;
                this.markDifference(currentVisitingPixelPosition);
            }
        }
    }

    private markDifference(pixelPosition: number) {
        this.differentPixelsPositionsWithOffset.set(pixelPosition, false);
        this.generateBlackPixel(pixelPosition);
    }

    private generateBlackPixel(pixelPosition: number) {
        this.whiteImageData.data[pixelPosition + RED_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + GREEN_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + BLUE_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + ALPHA_POS] = ALPHA_OPAQUE;
    }
}
