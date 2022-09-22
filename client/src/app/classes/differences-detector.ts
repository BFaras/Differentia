import { DifferencesImageGenerator } from './differences-image-generator';
import { ImageDataToCompare } from './image-data-to-compare';

const NB_BIT_PER_PIXEL = 4;
const RED_POS = 0;
const GREEN_POS = 1;
const BLUE_POS = 2;
const ALPHA_POS = 3;

export class DifferencesDetector {
    differenceImageGenerator: DifferencesImageGenerator;
    nbDifferences: number;

    constructor(readonly imageDatasToCompare: ImageDataToCompare, readonly offset: number) {
        this.differenceImageGenerator = new DifferencesImageGenerator(offset, imageDatasToCompare.imageWidth, imageDatasToCompare.imageHeight);
        this.generateDifferencesInformation();
        this.nbDifferences = this.countNbDifferences();
    }

    compareImagesPixels(originalImageData: Uint8ClampedArray, modifiedImageData: Uint8ClampedArray) {
        let differentPixelPositions: number[] = [];

        for (let i = 0; i < originalImageData.length; i += NB_BIT_PER_PIXEL) {
            const redDiff = originalImageData[i + RED_POS] - modifiedImageData[i + RED_POS];
            const greenDiff = originalImageData[i + GREEN_POS] - modifiedImageData[i + GREEN_POS];
            const blueDiff = originalImageData[i + BLUE_POS] - modifiedImageData[i + BLUE_POS];
            const alphaDiff = originalImageData[i + ALPHA_POS] - modifiedImageData[i + ALPHA_POS];

            if (redDiff !== 0 || greenDiff !== 0 || blueDiff !== 0 || alphaDiff !== 0) {
                differentPixelPositions.push(i);
            }
        }

        return differentPixelPositions;
    }

    generateDifferencesInformation() {
        let differentPixelsArray: number[] = [];

        differentPixelsArray = this.compareImagesPixels(this.imageDatasToCompare.originalImageData, this.imageDatasToCompare.modifiedImageData);
        this.differenceImageGenerator.generateImageFromDifferencesData(differentPixelsArray);
    }

    countNbDifferences() {
        // TD : Fonction qui trouve le nombre de differences
        const differentPixelsMap: Map<number, boolean> = this.differenceImageGenerator.getDifferentPixelsPositionWithOffset();
        let nbOfDifferences = 0;

        differentPixelsMap.forEach((hasBeenVisited, diffPixelPosition) => {
            if (!hasBeenVisited) {
                this.visitDifferentPixelsAround(diffPixelPosition, differentPixelsMap);
                this.markPixelAsVisited(diffPixelPosition, differentPixelsMap);
                nbOfDifferences++;
            }
        });

        return nbOfDifferences;
    }

    visitDifferentPixelsAround(diffPixelPosition: number, differentPixelsMap: Map<number, boolean>) {
        const dixPixelNumber = diffPixelPosition % NB_BIT_PER_PIXEL;
        const diffPixelLine = dixPixelNumber % this.imageDatasToCompare.imageHeight;
        const diffPixelColumn = dixPixelNumber % this.imageDatasToCompare.imageWidth;
        const circleRadiusToVisit = 1;

        for (let i = diffPixelColumn - this.offset; i < diffPixelColumn + this.offset; i++) {
            for (let j = diffPixelLine; (j - diffPixelLine) ** 2 + (i - diffPixelColumn) ** 2 <= circleRadiusToVisit ** 2; j--) {
                const currentVisitingPixelPosition = i * this.imageDatasToCompare.imageHeight + j * this.imageDatasToCompare.imageWidth;
                this.markPixelAsVisited(currentVisitingPixelPosition, differentPixelsMap);

                if (differentPixelsMap.has(currentVisitingPixelPosition) && !differentPixelsMap.get(currentVisitingPixelPosition)) {
                    this.visitDifferentPixelsAround(currentVisitingPixelPosition, differentPixelsMap);
                }
            }
            for (let j = diffPixelLine + 1; (j - diffPixelLine) ** 2 + (i - diffPixelColumn) ** 2 <= circleRadiusToVisit ** 2; j++) {
                const currentVisitingPixelPosition = i * this.imageDatasToCompare.imageHeight + j * this.imageDatasToCompare.imageWidth;
                this.markPixelAsVisited(currentVisitingPixelPosition, differentPixelsMap);

                if (differentPixelsMap.has(currentVisitingPixelPosition) && !differentPixelsMap.get(currentVisitingPixelPosition)) {
                    this.visitDifferentPixelsAround(currentVisitingPixelPosition, differentPixelsMap);
                }
            }
        }
    }

    markPixelAsVisited(pixelPosition: number, pixelsMap: Map<number, boolean>) {
        if (pixelsMap.has(pixelPosition)) {
            pixelsMap.set(pixelPosition, true);
        }
    }
}
