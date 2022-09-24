import { ImageDataToCompare } from './image-data-to-compare';

const NB_BIT_PER_PIXEL = 4;
const DEFAULT_DIFFERENCE_POSITION = 0;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

export class DifferencesDetector {
    private nbOfDifferences: number;
    private differentPixelsNumbersArray: number[];
    private pixelsDifferencesNbMap: Map<number, number>;

    constructor(readonly imageDatasToCompare: ImageDataToCompare, readonly offset: number) {
        this.differentPixelsNumbersArray = [];
        this.pixelsDifferencesNbMap = new Map<number, number>();
        this.nbOfDifferences = 0;

        this.generateDifferencesInformation();
        this.countDifferences();
    }

    getNbDifferences(): number {
        return this.nbOfDifferences;
    }

    getDifferentPixelsArray(): number[] {
        return this.differentPixelsNumbersArray;
    }

    getPixelsDifferencesNbMap() {
        return this.pixelsDifferencesNbMap;
    }

    private generateDifferencesInformation() {
        this.compareImagesPixels();

        this.pixelsDifferencesNbMap.forEach((differenceNb, diffPixelNumber) => {
            this.addPixelDifferenceOffset(diffPixelNumber);
        });
    }

    private compareImagesPixels() {
        // TD : Fonction qui dessine le offset autour du point
        // On génère un cercle autour du pixel au centre
        // Formule : (x – h)2+ (y – k)2 = r2
        // h = centre du cercle en X (ligne) et k = centre du cercle en Y (colonne)
        // r = rayon du cercle
        const originalImageData = this.imageDatasToCompare.originalImageData;
        const modifiedImageData = this.imageDatasToCompare.modifiedImageData;

        for (let i = 0; i < originalImageData.length; i += NB_BIT_PER_PIXEL) {
            const redDiff = originalImageData[i + RED_POS] - modifiedImageData[i + RED_POS];
            const greenDiff = originalImageData[i + GREEN_POS] - modifiedImageData[i + GREEN_POS];
            const blueDiff = originalImageData[i + BLUE_POS] - modifiedImageData[i + BLUE_POS];
            const alphaDiff = originalImageData[i + ALPHA_POS] - modifiedImageData[i + ALPHA_POS];

            if (redDiff !== 0 || greenDiff !== 0 || blueDiff !== 0 || alphaDiff !== 0) {
                const pixelPosition = i % NB_BIT_PER_PIXEL;

                this.differentPixelsNumbersArray.push(pixelPosition);
                this.pixelsDifferencesNbMap.set(pixelPosition, DEFAULT_DIFFERENCE_POSITION);
            }
        }
    }

    private addPixelDifferenceOffset(centerPixelPosition: number) {
        const centerPixelNumber = centerPixelPosition % NB_BIT_PER_PIXEL;
        const centerPixelLine = centerPixelNumber % this.imageDatasToCompare.imageHeight;
        const centerPixelColumn = centerPixelNumber % this.imageDatasToCompare.imageWidth;

        for (let i = centerPixelColumn - this.offset; i < centerPixelColumn + this.offset; i++) {
            for (let j = centerPixelLine; (j - centerPixelLine) ** 2 + (i - centerPixelColumn) ** 2 <= this.offset ** 2; j--) {
                const currentVisitingPixelPosition = i * this.imageDatasToCompare.imageHeight + j * this.imageDatasToCompare.imageWidth;
                this.pixelsDifferencesNbMap.set(currentVisitingPixelPosition, DEFAULT_DIFFERENCE_POSITION);
                this.differentPixelsNumbersArray.push(currentVisitingPixelPosition);
            }
            for (let j = centerPixelLine + 1; (j - centerPixelLine) ** 2 + (i - centerPixelColumn) ** 2 <= this.offset ** 2; j++) {
                const currentVisitingPixelPosition = i * this.imageDatasToCompare.imageHeight + j * this.imageDatasToCompare.imageWidth;
                this.pixelsDifferencesNbMap.set(currentVisitingPixelPosition, DEFAULT_DIFFERENCE_POSITION);
                this.differentPixelsNumbersArray.push(currentVisitingPixelPosition);
            }
        }
    }

    private countDifferences() {
        this.pixelsDifferencesNbMap.forEach((differenceNb, diffPixelNumber) => {
            if (differenceNb == 0) {
                this.nbOfDifferences++;
                this.markPixelDifferenceNb(diffPixelNumber);
                this.visitDifferentPixelsAround(diffPixelNumber);
            }
        });
    }

    visitDifferentPixelsAround(diffPixelNumber: number) {
        if (this.pixelsDifferencesNbMap.has(diffPixelNumber) && this.pixelsDifferencesNbMap.get(diffPixelNumber) != 0) {
            const diffPixelLine = diffPixelNumber % this.imageDatasToCompare.imageHeight;
            const diffPixelColumn = diffPixelNumber % this.imageDatasToCompare.imageWidth;
            const circleRadiusToVisit = 1;

            for (let i = diffPixelColumn - this.offset; i < diffPixelColumn + this.offset; i++) {
                for (let j = diffPixelLine; (j - diffPixelLine) ** 2 + (i - diffPixelColumn) ** 2 <= circleRadiusToVisit ** 2; j--) {
                    const currentVisitingPixelPosition = i * this.imageDatasToCompare.imageHeight + j * this.imageDatasToCompare.imageWidth;
                    this.markPixelDifferenceNb(currentVisitingPixelPosition);
                    this.visitDifferentPixelsAround(currentVisitingPixelPosition);
                }
                for (let j = diffPixelLine + 1; (j - diffPixelLine) ** 2 + (i - diffPixelColumn) ** 2 <= circleRadiusToVisit ** 2; j++) {
                    const currentVisitingPixelPosition = i * this.imageDatasToCompare.imageHeight + j * this.imageDatasToCompare.imageWidth;
                    this.markPixelDifferenceNb(currentVisitingPixelPosition);
                    this.visitDifferentPixelsAround(currentVisitingPixelPosition);
                }
            }
        }
    }

    markPixelDifferenceNb(pixelPosition: number) {
        if (this.pixelsDifferencesNbMap.has(pixelPosition)) {
            this.pixelsDifferencesNbMap.set(pixelPosition, this.nbOfDifferences);
        }
    }
}
