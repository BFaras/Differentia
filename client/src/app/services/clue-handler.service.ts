import { Injectable } from '@angular/core';
import { COMPASS_HEIGHT, COMPASS_IMAGES_BASIC_PATH, COMPASS_WIDTH } from '@app/client-consts';
import { CompassInformations } from '@app/interfaces/compass-informations';
import {
    CARDINAL_DIRECTION_RAD_ANGLE,
    CIRCLE_CIRCONFERENCE,
    FIRST_CLUE_NB,
    FIRST_CLUE_QUANDRANT_NB,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
    MIDDLE_OF_IMAGE_POSITION,
    SECOND_CLUE_QUANDRANT_NB,
} from '@common/const';
import { Position } from '@common/position';
import { Positions } from '@common/positions';

enum CardinalDirection {
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
    constructor() {}

    //To test Raph
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

    getCompassInformationsForClue(differencePixels: number[]): CompassInformations {
        const compassCardinalDirection = this.findDifferenceCardinalDirection(differencePixels);
        const compassImage: HTMLImageElement = new Image(COMPASS_WIDTH, COMPASS_HEIGHT);
        compassImage.src = COMPASS_IMAGES_BASIC_PATH + compassCardinalDirection;
        const compassInfo: CompassInformations = {
            compassClueImage: compassImage,
            isDifferenceClueMiddle: false,
        };
        return compassInfo;
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
        const pixelPosition: Position = this.convertPixelNbToPosition(differencePixels[Math.floor(differencePixels.length / 2)]);
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
}
