import { ClueFinderService } from '@app/services/clue-finder.service';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('ClueFinderService tests', () => {
    let clueFinderService: ClueFinderService;

    beforeEach(() => {
        clueFinderService = new ClueFinderService();
    });
    afterEach(async () => {
        sinon.restore();
    });

    it('should be true ', () => {
        expect(true).to.be.true;
    });
});
