import { expect } from 'chai';
import { ChronometerService } from './chronometer.service';
import { MAX_TIME, RESET_VALUE } from '../../../common/const';

describe('Chronometer service', () => {
    let chronometerService: ChronometerService;

    beforeEach(async () => {
        chronometerService = new ChronometerService();
    });

    it('should increase the seconds by 1', () => {
        let seconds = chronometerService.time.seconds;
        chronometerService.increaseSeconds();
        expect(chronometerService.time.seconds).to.equals(seconds+1);
    });

    it('should increase the minutes by 1', () => {
        let minutes = chronometerService.time.minutes;
        chronometerService.increaseMinutes();
        expect(chronometerService.time.minutes).to.equals(minutes+1);
    });

    it('when time is increased, it should only increase the seconds and not the minutes when the seconds are less than 59', () => {
        let seconds = chronometerService.time.seconds;
        let minutes = chronometerService.time.minutes;
        chronometerService.increaseTime();
        expect(chronometerService.time.seconds).to.equals(seconds+1);
        expect(chronometerService.time.minutes).to.equals(minutes);
    });

    it('when time is increased, it should increase the minutes and reset the seconds to 0 when the seconds are equal to 59', () => {
        chronometerService.time.seconds = MAX_TIME;
        let minutes = chronometerService.time.minutes;
        chronometerService.increaseTime();
        expect(chronometerService.time.seconds).to.equals(RESET_VALUE);
        expect(chronometerService.time.minutes).to.equals(minutes+1);
    });

    it('should reset the minutes and seconds to 0 when the chronometer is reset', () => {
        chronometerService.time.seconds = MAX_TIME;
        chronometerService.time.minutes = MAX_TIME;
        chronometerService.resetChrono();
        expect(chronometerService.time.seconds).to.equals(RESET_VALUE);
        expect(chronometerService.time.minutes).to.equals(RESET_VALUE);
    });

    // it('should add a 0 to the seconds when they are lower than 10', () => {
    //     chronometerService.time.seconds = LESS_THAN_10;
    //     let showableSeconds = chronometerService.showSeconds();
    //     expect(showableSeconds).to.equals('0' + LESS_THAN_10);
    // });

    // it('should add a 0 to the minutes when they are lower than 10', () => {
    //     chronometerService.time.minutes = LESS_THAN_10;
    //     let showableMinutes = chronometerService.showMinutes();
    //     expect(showableMinutes).to.equals('0' + LESS_THAN_10);
    // });

    // it('should not add a 0 to the seconds when they are higher than 9', () => {
    //     chronometerService.time.seconds = MORE_THAN_9;
    //     let showableSeconds = chronometerService.showSeconds();
    //     expect(showableSeconds).to.equals(MORE_THAN_9.toString());
    // });

    // it('should not add a 0 to the minutes when they are higher than 9', () => {
    //     chronometerService.time.minutes = MORE_THAN_9;
    //     let showableMinutes = chronometerService.showMinutes();
    //     expect(showableMinutes).to.equals(MORE_THAN_9.toString());
    // });
});
