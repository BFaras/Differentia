import { FIRST_CLUE_NB, FIRST_CLUE_QUANDRANT_NB, SECOND_CLUE_NB, SECOND_CLUE_QUANDRANT_NB } from '@app/server-consts';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
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
        const clueDifferenceNumber: number = randomInt(differencesList.length);
        const quadrantsLimits: Positions[] = this.findQuadrantsLimits(numberOfQuadrants);

        return 0;
    }

    private findQuadrantsLimits(numberOfQuadrants: number): Positions[] {
        const numberOfLimitsTranslations = Math.sqrt(numberOfQuadrants);
        const quandrantsWidthDistance: number = IMAGE_WIDTH / numberOfLimitsTranslations;
        const quandrantsHeightDistance: number = IMAGE_HEIGHT / numberOfLimitsTranslations;
        const quadrantsLimits: Positions[] = [];

        for (let currentWidthPos = 0; currentWidthPos < numberOfLimitsTranslations; currentWidthPos++) {
            for (let currentHeightPos = 0; currentHeightPos < numberOfLimitsTranslations; currentHeightPos++) {
                const beginningQuandrantPos: Position = {
                    x: quandrantsWidthDistance * currentWidthPos,
                    y: quandrantsHeightDistance * currentHeightPos,
                };

                const endingQuandrantPos: Position = {
                    x: quandrantsWidthDistance * (currentWidthPos + 1) - 1,
                    y: quandrantsHeightDistance * (currentHeightPos + 1) - 1,
                };

                quadrantsLimits.push({
                    beginningPosition: beginningQuandrantPos,
                    endingPosition: endingQuandrantPos,
                });
            }
        }

        return quadrantsLimits;
    }
}
