import { Canvas, Image } from 'canvas';
import { CanvasToCompare } from './canvas-to-compare';
import { ImagesToCompare } from './images-to-compare';

const NB_BIT_PER_PIXEL = 4;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

const BLACK = 0;
const ALPHA_OPAQUE = 1;

export class DifferencesDetector {
    private whiteImageData;

    constructor(readonly imagesToCompare: ImagesToCompare, readonly canvasToCompare: CanvasToCompare, readonly offset: number) {
        const whiteCanvas = new Canvas(this.imagesToCompare.originalImage.width, this.imagesToCompare.originalImage.height);
        const whiteImageContext = whiteCanvas.getContext('2d');
        whiteImageContext.fillStyle = 'white';
        whiteImageContext.fillRect(0, 0, whiteCanvas.width, whiteCanvas.height);

        this.whiteImageData = whiteImageContext.getImageData(0, 0, whiteCanvas.width, whiteCanvas.height);
    }

    getImageData(image: Image, canvas: Canvas) {
        const imageContext = canvas.getContext('2d');
        imageContext.drawImage(image, 0, 0);
        return imageContext.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    getDifferences(originalImage: Image, modifiedImage: Image) {
        let differentImage = false;

        const originalImageData = this.getImageData(originalImage, this.canvasToCompare.originalImageCanvas);
        const modifiedImageData = this.getImageData(modifiedImage, this.canvasToCompare.modifiedImageCanvas);

        for (let i = 0; i < originalImageData.length; i += NB_BIT_PER_PIXEL) {
            const redDiff = originalImageData[i + RED_POS] - modifiedImageData[i + RED_POS];
            const greenDiff = originalImageData[i + GREEN_POS] - modifiedImageData[i + GREEN_POS];
            const blueDiff = originalImageData[i + BLUE_POS] - modifiedImageData[i + BLUE_POS];
            const alphaDiff = originalImageData[i + ALPHA_POS] - modifiedImageData[i + ALPHA_POS];

            if (redDiff !== 0 || greenDiff !== 0 || blueDiff !== 0 || alphaDiff !== 0) {
                differentImage = true;
                this.generateDiffImage(i);
            }
        }

        const nbDiffereces = differentImage ? this.getNbDifferences() : 0;

        return { differentImage, nbDiffereces };
    }

    generateDiffImage(pixelPosition: number) {
        this.whiteImageData.data[pixelPosition + RED_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + GREEN_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + BLUE_POS] = BLACK;
        this.whiteImageData.data[pixelPosition + ALPHA_POS] = ALPHA_OPAQUE;
    }

    generateOffset() {
        // TD : Fonction qui dessine le offset autour du point
    }

    getNbDifferences() {
        // TD : Fonction qui trouve le nombre de differences
        return 0;
    }

    // Il manque les fonctions pour compter le nombre de differences (avec le offset) et une fontion qui
    // va dessiner le offset autour de chaque differences
}
