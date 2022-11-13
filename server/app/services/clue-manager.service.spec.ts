import { expect } from 'chai';
import * as sinon from 'sinon';
import { ClueManagerService } from './clue-manager.service';

describe('ClueManagerService tests', () => {
    let clueManagerService: ClueManagerService;

    beforeEach(() => {
        clueManagerService = new ClueManagerService();
    });
    afterEach(async () => {
        sinon.restore();
    });

    it('should be true', () => {
        expect(clueManagerService).to.be.true;
    });
});
