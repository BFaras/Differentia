import { RecordTime } from '@app/classes/record-time';

describe('RecordTime', () => {
    const plrName = 'hisName';
    const plrTime = '1:00';
    let recordTime: RecordTime;

    beforeEach(() => {
        recordTime = new RecordTime(plrTime, plrName);
    });

    it('should create an instance', () => {
        expect(recordTime).toBeTruthy();
    });

    it('instance should have correct values instantiated', () => {
        expect(recordTime.playerName).toEqual(plrName);
        expect(recordTime.time).toEqual(plrTime);
    });
});
