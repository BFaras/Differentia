import { FIRST_CLUE_NB, FIRST_CLUE_QUANDRANT_NB, SECOND_CLUE_NB, SECOND_CLUE_QUANDRANT_NB } from '@app/server-consts';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { Position } from '@common/position';
import { randomInt } from 'crypto';
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
        const clueDifferenceNumber = randomInt(differencesList.length);
        const quadrantsLimits: Position[] = [];
        const quandrantsWidthDistance = IMAGE_WIDTH / numberOfQuadrants;
        const quandrantsHeightDistance = IMAGE_HEIGHT / numberOfQuadrants;

        return 0;
    }
}
