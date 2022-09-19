import { Canvas, Image } from 'canvas';
import { CanvasToCompare } from './canvas-to-compare';
import { DifferencesImageGenerator } from './differences-image-generator';
import { ImagesToCompare } from './images-to-compare';

const NB_BIT_PER_PIXEL = 4;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

export class DifferencesDetector {
    public noOffsetDifferenceImageGenerator : DifferencesImageGenerator;
    public offsetDifferenceImageGenerator : DifferencesImageGenerator;

    constructor(readonly imagesToCompare: ImagesToCompare, readonly canvasToCompare: CanvasToCompare, readonly offset: number) {
        this.noOffsetDifferenceImageGenerator = new DifferencesImageGenerator(0, imagesToCompare.originalImage.width, imagesToCompare.originalImage.height);
        this.offsetDifferenceImageGenerator = new DifferencesImageGenerator(offset, imagesToCompare.originalImage.width, imagesToCompare.originalImage.height);
        this.generateDifferencesInformation();
    }

    getImageData(image: Image, canvas: Canvas) {
        const imageContext = canvas.getContext('2d');
        imageContext.drawImage(image, 0, 0);
        return imageContext.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    generateDifferencesInformation() {
        let differentImage = false;

        const originalImageData = this.getImageData(this.imagesToCompare.originalImage, this.canvasToCompare.originalImageCanvas);
        const modifiedImageData = this.getImageData(this.imagesToCompare.modifiedImage, this.canvasToCompare.modifiedImageCanvas);

        for (let i = 0; i < originalImageData.length; i += NB_BIT_PER_PIXEL) {
            const redDiff = originalImageData[i + RED_POS] - modifiedImageData[i + RED_POS];
            const greenDiff = originalImageData[i + GREEN_POS] - modifiedImageData[i + GREEN_POS];
            const blueDiff = originalImageData[i + BLUE_POS] - modifiedImageData[i + BLUE_POS];
            const alphaDiff = originalImageData[i + ALPHA_POS] - modifiedImageData[i + ALPHA_POS];

            if (redDiff !== 0 || greenDiff !== 0 || blueDiff !== 0 || alphaDiff !== 0) {
                differentImage = true;
                this.noOffsetDifferenceImageGenerator.addDifferencePixelsToImage(i);
                this.offsetDifferenceImageGenerator.addDifferencePixelsToImage(i);
            }
        }

        const nbDiffereces = differentImage ? this.getNbDifferences() : 0;

        return { differentImage, nbDiffereces };
    }

    getNbDifferences() {
        // TD : Fonction qui trouve le nombre de differences
        return 0;
    }

    // Il manque les fonctions pour compter le nombre de differences (avec le offset) et une fontion qui
    // va dessiner le offset autour de chaque differences
}
