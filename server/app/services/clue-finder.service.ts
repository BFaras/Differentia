import { FIRST_CLUE_NB, FIRST_CLUE_QUANDRANT_NB, SECOND_CLUE_NB, SECOND_CLUE_QUANDRANT_NB } from '@app/server-consts';
import { FIRST_ARRAY_POSITION, IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { Position } from '@common/position';
import { randomInt } from 'crypto';
import { Positions } from 'interfaces/positions';
import { Service } from 'typedi';

@Service()
export class ClueFinderService {
    constructor() {}

    findClueQuandrantFromClueNumber(clueNumber: number, differencesList: number[][]): number {
        if (clueNumber == FIRST_CLUE_NB) {
            return this.findClueQuadrant(FIRST_CLUE_QUANDRANT_NB, differencesList);
        } else if (clueNumber == SECOND_CLUE_NB) {
            return this.findClueQuadrant(SECOND_CLUE_QUANDRANT_NB, differencesList);
        } else {
            return -1;
        }
    }

    private findClueQuadrant(numberOfQuadrants: number, differencesList: number[][]): number {
        const clueDifferenceNb: number = randomInt(differencesList.length);
        const quadrantsLimits: Positions[] = this.findQuadrantsLimits(numberOfQuadrants);
        const clueDifferencePixelNb: number = differencesList[clueDifferenceNb][FIRST_ARRAY_POSITION];
        const clueDifferencePostion: Position = {
            x: this.findXPositionFromPixelNumber(clueDifferencePixelNb),
            y: this.findYPositionFromPixelNumber(clueDifferencePixelNb),
        };

        return 0;
    }

    private findQuadrantsLimits(numberOfQuadrants: number): Positions[] {
        const nbOfLimitsTranslations = Math.sqrt(numberOfQuadrants);
        const quadrantsLimits: Positions[] = [];

        for (let currentWidthPos = 0; currentWidthPos < nbOfLimitsTranslations; currentWidthPos++) {
            for (let currentHeightPos = 0; currentHeightPos < nbOfLimitsTranslations; currentHeightPos++) {
                quadrantsLimits.push(this.findQuadrantLimits(nbOfLimitsTranslations, currentWidthPos, currentHeightPos));
            }
        }

        return quadrantsLimits;
    }

    private findQuadrantLimits(nbOfLimitsTranslations: number, currentWidthPos: number, currentHeightPos: number): Positions {
        const quandrantsWidthDistance: number = IMAGE_WIDTH / nbOfLimitsTranslations;
        const quandrantsHeightDistance: number = IMAGE_HEIGHT / nbOfLimitsTranslations;

        const beginningQuadrantPos: Position = {
            x: quandrantsWidthDistance * currentWidthPos,
            y: quandrantsHeightDistance * currentHeightPos,
        };

        const endingQuadrantPos: Position = {
            x: quandrantsWidthDistance * (currentWidthPos + 1),
            y: quandrantsHeightDistance * (currentHeightPos + 1),
        };

        return {
            beginningPosition: beginningQuadrantPos,
            endingPosition: endingQuadrantPos,
        };
    }

    private findXPositionFromPixelNumber(pixelNumber: number): number {
        return 0;
    }

    private findYPositionFromPixelNumber(pixelNumber: number): number {
        return 0;
    }
}
