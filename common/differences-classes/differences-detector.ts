// import { ALPHA_POS, BLUE_POS, DEFAULT_DIFFERENCE_POSITION, GREEN_POS, NB_BIT_PER_PIXEL, RADIUS_AROUND_PIXEL, RED_POS } from '@common/const';
// import { ImageDataToCompare } from '@common/image-data-to-compare';
// import { Service } from 'typedi';

// @Service()
// export class DifferenceDetectorService {
//     private nbOfDifferences: number;
//     private differentPixelsNumbersArrayWithOffset: number[];
//     private pixelsDifferencesNbMap: Map<number, number>;
//     private imageDatasToCompare: ImageDataToCompare;
//     private offset: number;

//     constructor(imageDatasToCompare: ImageDataToCompare, offset: number) {
//         this.differentPixelsNumbersArrayWithOffset = [];
//         this.pixelsDifferencesNbMap = new Map<number, number>();
//         this.nbOfDifferences = 0;

//         this.generateDifferencesInformation();
//     }

//     getNbDifferences(): number {
//         return this.nbOfDifferences;
//     }

//     getDifferentPixelsArrayWithOffset(): number[] {
//         return this.differentPixelsNumbersArrayWithOffset;
//     }

//     getPixelsDifferencesNbMap() {
//         return this.pixelsDifferencesNbMap;
//     }

//     generateDifferencesInformation() {
//         let differentPixelsNumbersArray: number[];

//         this.compareImagesPixels();
//         differentPixelsNumbersArray = [...this.differentPixelsNumbersArrayWithOffset];

//         if (this.offset != 0) {
//             differentPixelsNumbersArray.forEach((diffPixelNumber) => {
//                 this.addPixelDifferenceOffset(diffPixelNumber);
//             });
//         }
//     }

//     private compareImagesPixels() {
//         const originalImageData = this.imageDatasToCompare.originalImageData;
//         const modifiedImageData = this.imageDatasToCompare.modifiedImageData;

//         for (let i = 0; i < originalImageData.length; i += NB_BIT_PER_PIXEL) {
//             const redDiff = originalImageData[i + RED_POS] - modifiedImageData[i + RED_POS];
//             const greenDiff = originalImageData[i + GREEN_POS] - modifiedImageData[i + GREEN_POS];
//             const blueDiff = originalImageData[i + BLUE_POS] - modifiedImageData[i + BLUE_POS];
//             const alphaDiff = originalImageData[i + ALPHA_POS] - modifiedImageData[i + ALPHA_POS];

//             if (redDiff !== 0 || greenDiff !== 0 || blueDiff !== 0 || alphaDiff !== 0) {
//                 const pixelPosition = i / NB_BIT_PER_PIXEL;

//                 this.differentPixelsNumbersArrayWithOffset.push(pixelPosition);
//                 this.pixelsDifferencesNbMap.set(pixelPosition, DEFAULT_DIFFERENCE_POSITION);
//             }
//         }
//     }

//     private addPixelDifferenceOffset(centerPixelPosition: number) {
//         // TD : Fonction qui dessine le offset autour du point
//         // On génère un cercle autour du pixel au centre
//         // Formule : (x – h)2+ (y – k)2 = r2
//         // h = centre du cercle en X (ligne) et k = centre du cercle en Y (colonne)
//         // r = rayon du cercle
//         const centerPixelLine = Math.floor(centerPixelPosition / this.imageDatasToCompare.imageWidth);
//         const centerPixelColumn = centerPixelPosition % this.imageDatasToCompare.imageWidth;
//         let offsetCloumnBeginning = this.clampValue(centerPixelColumn - this.offset, 0, this.imageDatasToCompare.imageWidth);

//         for (let column = offsetCloumnBeginning; column <= centerPixelColumn + this.offset; column++) {
//             this.addOffsetPixelToPixelsDownToColumnToVisit(column, centerPixelLine, centerPixelColumn);
//             this.addOffsetPixelToPixelsUpToColumnToVisit(column, centerPixelLine, centerPixelColumn);
//         }
//     }

//     addOffsetPixelToPixelsDownToColumnToVisit(currentColumn: number, centerPixelLine: number, centerPixelColumn: number) {
//         for (let line = centerPixelLine; (line - centerPixelLine) ** 2 + (currentColumn - centerPixelColumn) ** 2 <= this.offset ** 2 + 1; line++) {
//             const currentVisitingPixelPosition =
//                 (line + 1) * this.imageDatasToCompare.imageWidth + currentColumn - this.imageDatasToCompare.imageWidth;

//             if (!this.pixelsDifferencesNbMap.has(currentVisitingPixelPosition)) {
//                 this.pixelsDifferencesNbMap.set(currentVisitingPixelPosition, DEFAULT_DIFFERENCE_POSITION);
//                 this.differentPixelsNumbersArrayWithOffset.push(currentVisitingPixelPosition);
//             }
//         }
//     }

//     addOffsetPixelToPixelsUpToColumnToVisit(currentColumn: number, centerPixelLine: number, centerPixelColumn: number) {
//         for (let line = centerPixelLine; (line - centerPixelLine) ** 2 + (currentColumn - centerPixelColumn) ** 2 <= this.offset ** 2 + 1; line--) {
//             const currentVisitingPixelPosition =
//                 (line + 1) * this.imageDatasToCompare.imageWidth + currentColumn - this.imageDatasToCompare.imageWidth;

//             if (!this.pixelsDifferencesNbMap.has(currentVisitingPixelPosition)) {
//                 this.pixelsDifferencesNbMap.set(currentVisitingPixelPosition, DEFAULT_DIFFERENCE_POSITION);
//                 this.differentPixelsNumbersArrayWithOffset.push(currentVisitingPixelPosition);
//             }
//         }
//     }

//     countDifferences() {
//         this.pixelsDifferencesNbMap.forEach((differenceNb, diffPixelNumber) => {
//             if (differenceNb == 0) {
//                 this.nbOfDifferences++;
//                 this.visitPixelsInDifference(diffPixelNumber);
//             }
//         });
//     }

//     private visitPixelsInDifference(initialVisitedDifferentPixelNb: number) {
//         let pixelsToVisit: number[] = [initialVisitedDifferentPixelNb];
//         const FIRST_POS_INDEX = 0;

//         while (pixelsToVisit.length != 0) {
//             //console.log(this.nbOfDifferences, pixelsToVisit);
//             this.markPixelDifferenceNb(pixelsToVisit[FIRST_POS_INDEX]);
//             this.determinePixelsAround(pixelsToVisit[FIRST_POS_INDEX], pixelsToVisit);

//             pixelsToVisit = pixelsToVisit.filter((value, i, arr) => {
//                 return value != pixelsToVisit[FIRST_POS_INDEX];
//             });
//         }
//     }

//     determinePixelsAround(diffPixelNumber: number, pixelsToVisit: number[]) {
//         if (this.pixelsDifferencesNbMap.has(diffPixelNumber) && this.pixelsDifferencesNbMap.get(diffPixelNumber) != 0) {
//             const centerPixelLine = Math.floor(diffPixelNumber / this.imageDatasToCompare.imageWidth);
//             const centerPixelColumn = diffPixelNumber % this.imageDatasToCompare.imageWidth;
//             let offsetCloumnBeginning = this.clampValue(centerPixelColumn - RADIUS_AROUND_PIXEL, 0, this.imageDatasToCompare.imageWidth);

//             for (let column = offsetCloumnBeginning; column <= centerPixelColumn + RADIUS_AROUND_PIXEL; column++) {
//                 this.addPixelsUpToCurrentColumnToVisit(column, centerPixelLine, centerPixelColumn, pixelsToVisit);
//                 this.addPixelsDownToCurrentColumnToVisit(column, centerPixelLine, centerPixelColumn, pixelsToVisit);
//             }
//         }
//     }

//     private addPixelsUpToCurrentColumnToVisit(currentColumn: number, centerPixelLine: number, centerPixelColumn: number, pixelsToVisit: number[]) {
//         for (
//             let line = centerPixelLine;
//             (line - centerPixelLine) ** 2 + (currentColumn - centerPixelColumn) ** 2 <= RADIUS_AROUND_PIXEL ** 2 + 1;
//             line++
//         ) {
//             const currentVisitingPixelPosition =
//                 (line + 1) * this.imageDatasToCompare.imageWidth + currentColumn - this.imageDatasToCompare.imageWidth;

//             if (!this.isPixelVisited(currentVisitingPixelPosition)) {
//                 this.markPixelDifferenceNb(currentVisitingPixelPosition);
//                 pixelsToVisit.push(currentVisitingPixelPosition);
//             }
//         }
//     }

//     private addPixelsDownToCurrentColumnToVisit(currentColumn: number, centerPixelLine: number, centerPixelColumn: number, pixelsToVisit: number[]) {
//         for (
//             let line = centerPixelLine;
//             (line - centerPixelLine) ** 2 + (currentColumn - centerPixelColumn) ** 2 <= RADIUS_AROUND_PIXEL ** 2 + 1;
//             line--
//         ) {
//             const currentVisitingPixelPosition =
//                 (line + 1) * this.imageDatasToCompare.imageWidth + currentColumn - this.imageDatasToCompare.imageWidth;

//             if (!this.isPixelVisited(currentVisitingPixelPosition)) {
//                 this.markPixelDifferenceNb(currentVisitingPixelPosition);
//                 pixelsToVisit.push(currentVisitingPixelPosition);
//             }
//         }
//     }

//     private isPixelVisited(pixelPosition: number): boolean {
//         return this.pixelsDifferencesNbMap.has(pixelPosition) && this.pixelsDifferencesNbMap.get(pixelPosition) != 0;
//     }

//     private markPixelDifferenceNb(pixelPosition: number) {
//         if (this.pixelsDifferencesNbMap.has(pixelPosition)) {
//             this.pixelsDifferencesNbMap.set(pixelPosition, this.nbOfDifferences);
//         }
//     }

//     private clampValue(value: number, min: number, max: number) {
//         if (value < min) {
//             value = min;
//         } else if (value > max) {
//             value = max;
//         }
//         return value;
//     }
// }
