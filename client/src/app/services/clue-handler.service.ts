import { Injectable } from '@angular/core';
import {
    ADDITION_FACTOR,
    COMPASS_HEIGHT,
    COMPASS_IMAGES_BASIC_PATH,
    COMPASS_WIDTH,
    PNG_FILE_TYPE_SRC,
    SUBSTRACTION_FACTOR,
} from '@app/const/client-consts';
import { CompassInformations } from '@app/interfaces/compass-informations';
import {
    CARDINAL_DIRECTION_RAD_ANGLE,
    CIRCLE_CIRCONFERENCE,
    FIRST_ARRAY_POSITION,
    FIRST_CLUE_NB,
    FIRST_CLUE_QUANDRANT_NB,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
    MIDDLE_OF_IMAGE_POSITION,
    SECOND_CLUE_QUANDRANT_NB,
} from '@common/const';
import { Position } from '@common/position';
import { Positions } from '@common/positions';
import { ImageToImageDifferenceService } from './image-to-image-difference.service';

export enum CardinalDirection {
    East,
    NorthEast,
    North,
    NorthWest,
    West,
    SouthWest,
    South,
    SouthEast,
}

@Injectable({
    providedIn: 'root',
})
export class ClueHandlerService {
    constructor(private imageToImageDiffService: ImageToImageDifferenceService) {}

    findClueQuadrantPixels(clueNb: number, quadrantNb: number): number[] {
        const quadrantPixelsNb: number[] = [];
        const quadrantLimits = this.findQuadrantLimitsFromClueNb(clueNb, quadrantNb);

        for (let currentWidthPos = quadrantLimits.beginningPosition.x; currentWidthPos <= quadrantLimits.endingPosition.x; currentWidthPos++) {
            for (let currentHeightPos = quadrantLimits.beginningPosition.y; currentHeightPos <= quadrantLimits.endingPosition.y; currentHeightPos++) {
                quadrantPixelsNb.push(this.convertPositionToPixelNb(currentWidthPos, currentHeightPos));
            }
        }

        return quadrantPixelsNb;
    }

    async getCompassInformationsForClue(differencePixels: number[]): Promise<CompassInformations> {
        const compassCardinalDirection = this.findDifferenceCardinalDirection(differencePixels);

        const compassInfo: CompassInformations = {
            compassClueImage: await this.loadCompassImageWithRightSize(compassCardinalDirection),
            isDifferenceClueMiddle: this.isDifferenceClueInMiddleBehindCompass(differencePixels),
        };

        if (compassInfo.isDifferenceClueMiddle) {
            compassInfo.compassClueImage = await this.loadCompassImageWithRightSize(CardinalDirection.West);
        }

        return Promise.resolve(compassInfo);
    }

    private async loadCompassImageWithRightSize(compassCardinalDirection: CardinalDirection): Promise<HTMLImageElement> {
        const compassImage: HTMLImageElement = new Image();

        compassImage.src = COMPASS_IMAGES_BASIC_PATH + compassCardinalDirection + PNG_FILE_TYPE_SRC;
        await this.imageToImageDiffService.waitForImageToLoad(compassImage);
        compassImage.width = COMPASS_WIDTH;
        compassImage.height = COMPASS_HEIGHT;

        return Promise.resolve(compassImage);
    }

    private findQuadrantLimitsFromClueNb(clueNb: number, quadrantNb: number): Positions {
        if (clueNb == FIRST_CLUE_NB) {
            return this.findQuadrantLimits(FIRST_CLUE_QUANDRANT_NB, quadrantNb);
        } else {
            return this.findQuadrantLimits(SECOND_CLUE_QUANDRANT_NB, quadrantNb);
        }
    }

    private findQuadrantLimits(nbOfQuadrants: number, quadrantNb: number): Positions {
        const nbOfLimitsTranslations = Math.sqrt(nbOfQuadrants);
        const quandrantsWidthDistance: number = IMAGE_WIDTH / nbOfLimitsTranslations;
        const quandrantsHeightDistance: number = IMAGE_HEIGHT / nbOfLimitsTranslations;
        const quadrantWidthPos = Math.floor(quadrantNb / nbOfLimitsTranslations);
        const quadrantHeightPos = quadrantNb % nbOfLimitsTranslations;

        const beginningQuadrantPos: Position = {
            x: quandrantsWidthDistance * quadrantWidthPos,
            y: quandrantsHeightDistance * quadrantHeightPos,
        };

        const endingQuadrantPos: Position = {
            x: quandrantsWidthDistance * (quadrantWidthPos + 1) - 1,
            y: quandrantsHeightDistance * (quadrantHeightPos + 1) - 1,
        };

        return {
            beginningPosition: beginningQuadrantPos,
            endingPosition: endingQuadrantPos,
        };
    }

    private convertPositionToPixelNb(width: number, height: number): number {
        return (height + 1) * IMAGE_WIDTH + width - IMAGE_WIDTH;
    }

    private convertPixelNbToPosition(pixelNb: number): Position {
        return {
            x: pixelNb % IMAGE_WIDTH,
            y: Math.floor(pixelNb / IMAGE_WIDTH),
        };
    }

    private findDifferenceCardinalDirection(differencePixels: number[]): CardinalDirection {
        const cardinalDirectionsLength = Object.keys(CardinalDirection).length;
        let differenceCardinalDirection: CardinalDirection = cardinalDirectionsLength - 1;
        const pixelPosition: Position = this.convertPixelNbToPosition(differencePixels[FIRST_ARRAY_POSITION]);
        let differenceAngleWithOrigin = -Math.atan2(pixelPosition.y - MIDDLE_OF_IMAGE_POSITION.y, pixelPosition.x - MIDDLE_OF_IMAGE_POSITION.x);

        if (differenceAngleWithOrigin < 0) {
            differenceAngleWithOrigin = CIRCLE_CIRCONFERENCE + differenceAngleWithOrigin;
        }

        for (let cardinalDirection: CardinalDirection = 0; cardinalDirection < cardinalDirectionsLength - 1; cardinalDirection++) {
            const currentCardinalAngle = this.calculateCardinalDirectionAngle(cardinalDirection);
            const nextCardinalAngle = this.calculateCardinalDirectionAngle(cardinalDirection + 1);

            if (differenceAngleWithOrigin >= currentCardinalAngle && differenceAngleWithOrigin < nextCardinalAngle) {
                differenceCardinalDirection = cardinalDirection;
            }
        }

        return differenceCardinalDirection;
    }

    private calculateCardinalDirectionAngle(cardinalDirection: CardinalDirection): number {
        return cardinalDirection * CARDINAL_DIRECTION_RAD_ANGLE;
    }

    private isDifferenceClueInMiddleBehindCompass(differencePixels: number[]) {
        const canvasMiddleLimits: Positions = this.getCanvasMiddleLimits();
        let isInMiddleBehindCompass = false;

        for (let pixelNb of differencePixels) {
            const pixelPosition: Position = this.convertPixelNbToPosition(pixelNb);
            if (this.isInTheBoundsOfLimitPositions(canvasMiddleLimits, pixelPosition)) {
                isInMiddleBehindCompass = true;
                break;
            }
        }

        return isInMiddleBehindCompass;
    }

    private isInTheBoundsOfLimitPositions(limitPositions: Positions, positionToCheck: Position): boolean {
        return (
            positionToCheck.x >= limitPositions.beginningPosition.x &&
            positionToCheck.y >= limitPositions.beginningPosition.y &&
            positionToCheck.x <= limitPositions.endingPosition.x &&
            positionToCheck.y <= limitPositions.endingPosition.y
        );
    }

    private getCanvasMiddleLimits(): Positions {
        return {
            beginningPosition: this.getCanvasMiddleLimit(SUBSTRACTION_FACTOR),
            endingPosition: this.getCanvasMiddleLimit(ADDITION_FACTOR),
        };
    }

    private getCanvasMiddleLimit(multiplyingAddtionFactor: number): Position {
        return {
            x: MIDDLE_OF_IMAGE_POSITION.x + Math.floor(COMPASS_WIDTH / 2) * multiplyingAddtionFactor,
            y: MIDDLE_OF_IMAGE_POSITION.y + Math.floor(COMPASS_HEIGHT / 2) * multiplyingAddtionFactor,
        };
    }
}
