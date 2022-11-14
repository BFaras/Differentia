import { INCORRECT_CLUE_NB_ERROR } from '@app/server-consts';
import { ClueFinderService } from '@app/services/clue-finder.service';
import { FIRST_CLUE_NB, FIRST_CLUE_QUANDRANT_NB, SECOND_CLUE_NB, SECOND_CLUE_QUANDRANT_NB } from '@common/const';
import { Position } from '@common/position';
import { expect } from 'chai';
import { Positions } from 'interfaces/positions';
import * as sinon from 'sinon';
import { MouseHandlerService } from './mouse-handler.service';

describe('ClueFinderService tests', () => {
    let clueFinderService: ClueFinderService;
    let mouseHandlerService: MouseHandlerService;

    before(() => {
        mouseHandlerService = new MouseHandlerService();
    });

    beforeEach(() => {
        clueFinderService = new ClueFinderService();
    });
    afterEach(async () => {
        sinon.restore();
    });

    it('should be in quadrant 0 when difference is at the quadrant 0 beginning and clue is 1', () => {
        const correctQuadrantNb = 0;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.beginningPosition.x,
            y: testQuadrantLimits.beginningPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 0 is at the quadrant 0 end and clue is 1', () => {
        const correctQuadrantNb = 0;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.endingPosition.x,
            y: testQuadrantLimits.endingPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 1 when difference is at the quadrant 1 beginning and clue is 1', () => {
        const correctQuadrantNb = 1;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.beginningPosition.x,
            y: testQuadrantLimits.beginningPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 1 is at the quadrant 1 end and clue is 1', () => {
        const correctQuadrantNb = 1;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.endingPosition.x,
            y: testQuadrantLimits.endingPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 2 when difference is at the quadrant 2 beginning and clue is 1', () => {
        const correctQuadrantNb = 2;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.beginningPosition.x,
            y: testQuadrantLimits.beginningPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 2 is at the quadrant 2 end and clue is 1', () => {
        const correctQuadrantNb = 2;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.endingPosition.x,
            y: testQuadrantLimits.endingPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 3 when difference is at the quadrant 3 beginning and clue is 1', () => {
        const correctQuadrantNb = 3;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.beginningPosition.x,
            y: testQuadrantLimits.beginningPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 3 is at the quadrant 3 end and clue is 1', () => {
        const correctQuadrantNb = 3;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](FIRST_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.endingPosition.x,
            y: testQuadrantLimits.endingPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 12 when difference is at the quadrant 12 beginning and clue is 2', () => {
        const correctQuadrantNb = 12;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](SECOND_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.beginningPosition.x,
            y: testQuadrantLimits.beginningPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(SECOND_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should be in quadrant 12 is at the quadrant 12 end and clue is 2', () => {
        const correctQuadrantNb = 12;
        const testQuadrantLimits: Positions = clueFinderService['findQuadrantsLimits'](SECOND_CLUE_QUANDRANT_NB)[correctQuadrantNb];
        const testPosition: Position = {
            x: testQuadrantLimits.endingPosition.x,
            y: testQuadrantLimits.endingPosition.y,
        };

        const testDifferenceList: number[][] = [[mouseHandlerService['convertMousePositionToPixelNumber'](testPosition)]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(SECOND_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });

    it('should return -1 if the clue number is invalid', () => {
        const testDifferenceList: number[][] = [[0]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(SECOND_CLUE_NB - 1, testDifferenceList)).to.equal(INCORRECT_CLUE_NB_ERROR);
    });

    it('should be in quadrant 0 when all differences in list are in quadrant 0', () => {
        const correctQuadrantNb = 0;
        const testDifferenceList: number[][] = [[0], [2], [4]];
        expect(clueFinderService.findClueQuandrantFromClueNumber(FIRST_CLUE_NB, testDifferenceList)).to.equal(correctQuadrantNb);
    });
});
