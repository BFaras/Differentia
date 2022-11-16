import { TestBed } from '@angular/core/testing';
import { FIRST_CLUE_NB } from '@common/const';
import { Position } from '@common/position';
import { Positions } from '@common/positions';

import { ClueHandlerService } from './clue-handler.service';

fdescribe('ClueHandlerService', () => {
    let service: ClueHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClueHandlerService);
    });

    it('should have beginning (0,0) and end (319,239) for quadrant 0 and clue is first', () => {
        const testQuadrantNb = 0;
        const testClueNb = FIRST_CLUE_NB;
        const testBeginningPos: Position = {
            x: 0,
            y: 0,
        };
        const testEndingPos: Position = {
            x: 319,
            y: 239,
        };
        const testPositionsExpected: Positions = {
            beginningPosition: testBeginningPos,
            endingPosition: testEndingPos,
        };
        expect(service['findQuadrantLimitsFromClueNb'](testClueNb, testQuadrantNb)).toEqual(testPositionsExpected);
    });

    it('should have beginning (0,240) and end (319,480) for quadrant 1 and clue is 1', () => {
        const testQuadrantNb = 1;
        const testClueNb = FIRST_CLUE_NB;
        const testBeginningPos: Position = {
            x: 0,
            y: 240,
        };
        const testEndingPos: Position = {
            x: 319,
            y: 479,
        };
        const testPositionsExpected: Positions = {
            beginningPosition: testBeginningPos,
            endingPosition: testEndingPos,
        };
        expect(service['findQuadrantLimitsFromClueNb'](testClueNb, testQuadrantNb)).toEqual(testPositionsExpected);
    });

    it('should have beginning (320,0) and end (639,239) for quadrant 1 and clue is 2', () => {
        const testQuadrantNb = 2;
        const testClueNb = FIRST_CLUE_NB;
        const testBeginningPos: Position = {
            x: 320,
            y: 0,
        };
        const testEndingPos: Position = {
            x: 639,
            y: 239,
        };
        const testPositionsExpected: Positions = {
            beginningPosition: testBeginningPos,
            endingPosition: testEndingPos,
        };
        expect(service['findQuadrantLimitsFromClueNb'](testClueNb, testQuadrantNb)).toEqual(testPositionsExpected);
    });
});
