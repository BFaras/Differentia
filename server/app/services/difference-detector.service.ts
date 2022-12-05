import {
    ALPHA_POS,
    BLUE_POS,
    DEFAULT_DIFFERENCE_POSITION,
    DEFAULT_NB_OF_DIFFERENCES,
    DOWN,
    EMPTY_ARRAY_LENGTH,
    EMPTY_OFFSET_NB,
    FIRST_ARRAY_POSITION,
    GREEN_POS,
    MINIMUM_PIXEL_POSITION,
    NB_BIT_PER_PIXEL,
    RADIUS_AROUND_PIXEL,
    RED_POS,
    UP,
} from '@common/const';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import Container, { Service } from 'typedi';
import { HashmapConverterService } from './hashmap-converter.service';

@Service()
export class DifferenceDetectorService {
    private nbOfDifferences: number;
    private pixelsDifferencesNbMap: Map<number, number>;
    private offset: number;

    constructor(private imageDatasToCompare: ImageDataToCompare) {
        this.offset = imageDatasToCompare.offSet;
        this.pixelsDifferencesNbMap = new Map<number, number>();
        this.nbOfDifferences = DEFAULT_NB_OF_DIFFERENCES;

        this.generateDifferencesInformation();
        this.countDifferences();
    }

    getNbDifferences(): number {
        return this.nbOfDifferences;
    }

    generateDifferencesList(): number[][] {
        const hashmapConverterService = Container.get(HashmapConverterService);
        return hashmapConverterService.convertNumberMapToNumber2DArray(this.pixelsDifferencesNbMap, this.nbOfDifferences);
    }

    private generateDifferencesInformation() {
        const differentPixelsNumbersArray: number[] = [];

        this.compareImagesPixels(differentPixelsNumbersArray);

        if (this.offset !== EMPTY_OFFSET_NB) {
            differentPixelsNumbersArray.forEach((diffPixelNumber) => {
                this.addPixelDifferenceOffset(diffPixelNumber);
            });
        }
    }

    private compareImagesPixels(differentPixelsNumbersArray: number[]) {
        for (let i = FIRST_ARRAY_POSITION; i < this.imageDatasToCompare.originalImageData.length; i += NB_BIT_PER_PIXEL) {
            if (this.isPixelDifferent(i)) {
                const pixelPosition = i / NB_BIT_PER_PIXEL;

                differentPixelsNumbersArray.push(pixelPosition);
                this.pixelsDifferencesNbMap.set(pixelPosition, DEFAULT_DIFFERENCE_POSITION);
            }
        }
    }

    private getColorDifference(colorPos: number) {
        return Math.abs(this.imageDatasToCompare.originalImageData[colorPos] - this.imageDatasToCompare.modifiedImageData[colorPos]);
    }

    private isPixelDifferent(pixelPos: number) {
        return (
            this.getColorDifference(pixelPos + RED_POS) +
            this.getColorDifference(pixelPos + GREEN_POS) +
            this.getColorDifference(pixelPos + BLUE_POS) +
            this.getColorDifference(pixelPos + ALPHA_POS)
        );
    }

    private addPixelDifferenceOffset(centerPixelPosition: number) {
        // On génère un cercle autour du pixel au centre
        // Formule : (x – h)2+ (y – k)2 = r2
        // h = centre du cercle en X (ligne) et k = centre du cercle en Y (colonne)
        // r = rayon du cercle
        const centerPixelLine = Math.floor(centerPixelPosition / this.imageDatasToCompare.imageWidth);
        const centerPixelColumn = centerPixelPosition % this.imageDatasToCompare.imageWidth;
        const offsetCloumnBeginning = this.clampValue(centerPixelColumn - this.offset, MINIMUM_PIXEL_POSITION, this.imageDatasToCompare.imageWidth);

        for (let column = offsetCloumnBeginning; column <= centerPixelColumn + this.offset; column++) {
            this.addOffsetPixelToColumnToVisit(column, centerPixelLine, centerPixelColumn);
        }
    }

    private addOffsetPixelToColumnToVisit(column: number, centerPixelLine: number, centerPixelColumn: number) {
        this.addOffsetPixelToPixelsArroundToColumnToVisit(column, centerPixelLine, centerPixelColumn, DOWN);
        this.addOffsetPixelToPixelsArroundToColumnToVisit(column, centerPixelLine, centerPixelColumn, UP);
    }

    private addOffsetPixelToPixelsArroundToColumnToVisit(
        currentColumn: number,
        centerPixelLine: number,
        centerPixelColumn: number,
        upOrDown: number,
    ) {
        for (
            let line = centerPixelLine;
            this.isPixelInCircle(line, currentColumn, centerPixelLine, centerPixelColumn, this.offset);
            line += upOrDown
        ) {
            const currentVisitingPixelPosition =
                (line + 1) * this.imageDatasToCompare.imageWidth + currentColumn - this.imageDatasToCompare.imageWidth;

            if (!this.pixelsDifferencesNbMap.has(currentVisitingPixelPosition)) {
                this.pixelsDifferencesNbMap.set(currentVisitingPixelPosition, DEFAULT_DIFFERENCE_POSITION);
            }
        }
    }
    private countDifferences() {
        this.pixelsDifferencesNbMap.forEach((differenceNb, diffPixelNumber) => {
            if (differenceNb === DEFAULT_DIFFERENCE_POSITION) {
                this.visitPixelsInDifference(diffPixelNumber);
                this.nbOfDifferences++;
            }
        });
    }

    private visitPixelsInDifference(initialVisitedDifferentPixelNb: number) {
        let pixelsToVisit: number[] = [initialVisitedDifferentPixelNb];

        while (pixelsToVisit.length !== EMPTY_ARRAY_LENGTH) {
            const pixelPositionToVisit = pixelsToVisit[FIRST_ARRAY_POSITION];
            if (this.isPixelDifferenceInMap(pixelPositionToVisit)) {
                this.markPixelDifferenceNb(pixelPositionToVisit);
                this.determinePixelsAround(pixelPositionToVisit, pixelsToVisit);
            }

            pixelsToVisit = pixelsToVisit.filter((value, i, arr) => {
                return value !== pixelPositionToVisit;
            });
        }
    }

    private determinePixelsAround(diffPixelNumber: number, pixelsToVisit: number[]) {
        const centerPixelLine = Math.floor(diffPixelNumber / this.imageDatasToCompare.imageWidth);
        const centerPixelColumn = diffPixelNumber % this.imageDatasToCompare.imageWidth;
        const offsetCloumnBeginning = this.clampValue(
            centerPixelColumn - RADIUS_AROUND_PIXEL,
            MINIMUM_PIXEL_POSITION,
            this.imageDatasToCompare.imageWidth,
        );

        for (let column = offsetCloumnBeginning; column <= centerPixelColumn + RADIUS_AROUND_PIXEL; column++) {
            this.addPixelsToCurrentColumnToVisit(column, centerPixelLine, centerPixelColumn, pixelsToVisit);
        }
    }

    private addPixelsToCurrentColumnToVisit(column: number, centerPixelLine: number, centerPixelColumn: number, pixelsToVisit: number[]) {
        this.addPixelsArroundCurrentColumnToVisit(column, centerPixelLine, centerPixelColumn, pixelsToVisit, UP);
        this.addPixelsArroundCurrentColumnToVisit(column, centerPixelLine, centerPixelColumn, pixelsToVisit, DOWN);
    }

    private addPixelsArroundCurrentColumnToVisit(
        currentColumn: number,
        centerPixelLine: number,
        centerPixelColumn: number,
        pixelsToVisit: number[],
        upOrDown: number,
    ) {
        for (
            let line = centerPixelLine;
            this.isPixelInCircle(line, currentColumn, centerPixelLine, centerPixelColumn, RADIUS_AROUND_PIXEL);
            line += upOrDown
        ) {
            const currentVisitingPixelPosition =
                (line + 1) * this.imageDatasToCompare.imageWidth + currentColumn - this.imageDatasToCompare.imageWidth;

            if (this.isPixelDifferenceInMap(currentVisitingPixelPosition) && !this.isPixelVisited(currentVisitingPixelPosition)) {
                pixelsToVisit.push(currentVisitingPixelPosition);
            }
        }
    }

    private isPixelInCircle(currentLine: number, currentColumn: number, centerPixelLine: number, centerPixelColumn: number, offset: number): boolean {
        return (currentLine - centerPixelLine) ** 2 + (currentColumn - centerPixelColumn) ** 2 <= offset ** 2 + 1;
    }

    private isPixelVisited(pixelPosition: number): boolean {
        return this.pixelsDifferencesNbMap.get(pixelPosition) !== DEFAULT_DIFFERENCE_POSITION;
    }

    private isPixelDifferenceInMap(pixelPosition: number) {
        return this.pixelsDifferencesNbMap.has(pixelPosition);
    }

    private markPixelDifferenceNb(pixelPosition: number) {
        if (this.isPixelDifferenceInMap(pixelPosition) && !this.isPixelVisited(pixelPosition)) {
            this.pixelsDifferencesNbMap.set(pixelPosition, this.nbOfDifferences);
        }
    }

    private clampValue(value: number, min: number, max: number): number {
        if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        return value;
    }
}
