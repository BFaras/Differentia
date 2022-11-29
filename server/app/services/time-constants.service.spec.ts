import { TimeConstants } from '@common/time-constants';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { TimeConstantsService } from './time-constants.service';
chai.use(chaiAsPromised);

describe('Time constants service', () => {
    let timeConstantsService: TimeConstantsService;
    let time1: TimeConstants;

    beforeEach(async () => {
        timeConstantsService = new TimeConstantsService();
        timeConstantsService['gamesFilePath'] = 'testTimes.json';

        time1 = {
            initialTime: 30,
            penaltyTime: 5,
            savedTime: 5,
        };
        await timeConstantsService.setTimes(time1);
    });

    afterEach(async () => {
        sinon.restore();
    });

    it('should input the times when the JSON file is read', async () => {
        await timeConstantsService.getTimes();
        expect(timeConstantsService['timeConstants']).to.deep.equals(time1);
    });

    it('should write in json the times', async () => {
        const stub = sinon.stub(fs.promises, 'writeFile').callsFake(async () => {});
        await timeConstantsService.setTimes(time1);
        expect(stub.callsFake);
    });
});
