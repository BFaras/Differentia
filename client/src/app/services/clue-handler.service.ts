import { Injectable } from '@angular/core';
import { FIRST_CLUE_NB, FIRST_CLUE_QUANDRANT_NB, IMAGE_HEIGHT, IMAGE_WIDTH, SECOND_CLUE_QUANDRANT_NB } from '@common/const';
import { Position } from '@common/position';
import { Positions } from '@common/positions';

@Injectable({
    providedIn: 'root',
})
export class ClueHandlerService {
    constructor() {}

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

        console.log(quadrantWidthPos);
        console.log(quadrantHeightPos);

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
}
