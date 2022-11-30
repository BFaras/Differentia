import { ONE_SECOND_OFFSET } from '@app/server-consts';
import { CLASSIC_MODE, LIMITED_TIME_MODE, MAX_TIME, RESET_VALUE } from '@common/const';
import { TimeConstants } from '@common/time-constants';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from 'socket.io';
import { ChronometerService } from './chronometer.service';

describe('Chronometer service', () => {
    let chronometerService: ChronometerService;
    let testSocket: io.Socket;
    const RANDOM_NUMBER = 5;
    const TWO_MINUTES = 2;
    const timeConstants: TimeConstants = {
        penaltyTime: RANDOM_NUMBER,
        savedTime: RANDOM_NUMBER,
        initialTime: RANDOM_NUMBER,
    };

    beforeEach(async () => {
        chronometerService = new ChronometerService();
    });

    it('should increase the seconds by 1', () => {
        const seconds = chronometerService.time.seconds;
        chronometerService['increaseSeconds']();
        expect(chronometerService.time.seconds).to.equals(seconds + 1);
    });

    it('should increase the minutes by 1', () => {
        const minutes = chronometerService.time.minutes;
        chronometerService['increaseMinutes']();
        expect(chronometerService.time.minutes).to.equals(minutes + 1);
    });

    it('when time is increased, it should only increase the seconds and not the minutes when the seconds are less than 59', () => {
        const seconds = chronometerService.time.seconds;
        const minutes = chronometerService.time.minutes;
        chronometerService.mode = CLASSIC_MODE;
        chronometerService.changeTime();
        expect(chronometerService.time.seconds).to.equals(seconds + 1);
        expect(chronometerService.time.minutes).to.equals(minutes);
    });

    it('when time is increased, it should increase the minutes and reset the seconds to 0 when the seconds are equal to 59', () => {
        chronometerService.time.seconds = MAX_TIME;
        const minutes = chronometerService.time.minutes;
        chronometerService.mode = CLASSIC_MODE;
        chronometerService.changeTime();
        expect(chronometerService.time.seconds).to.equals(RESET_VALUE);
        expect(chronometerService.time.minutes).to.equals(minutes + 1);
    });

    it('should reset the minutes and seconds to 0 when the chronometer is reset', () => {
        chronometerService.time.seconds = MAX_TIME;
        chronometerService.time.minutes = MAX_TIME;
        chronometerService.resetChrono();
        expect(chronometerService.time.seconds).to.equals(RESET_VALUE);
        expect(chronometerService.time.minutes).to.equals(RESET_VALUE);
    });

    it('hasTheChronoHitZero should return true when the minutes and seconds are both equal to 0', () => {
        expect(chronometerService.hasTheChronoHitZero()).to.equal(true);
    });

    it('hasTheChronoHitZero should return false when the minutes and seconds are not both equal to 0', () => {
        chronometerService.time.seconds = MAX_TIME;
        chronometerService.time.minutes = MAX_TIME;
        expect(chronometerService.hasTheChronoHitZero()).to.equal(false);
    });

    it('when time is decreased, it should only decrease the seconds and not the minutes when the seconds are higher than 0', () => {
        chronometerService.time.seconds = MAX_TIME;
        chronometerService.mode = LIMITED_TIME_MODE;
        chronometerService.changeTime();
        expect(chronometerService.time.seconds).to.equals(MAX_TIME - 1);
        expect(chronometerService.time.minutes).to.equals(RESET_VALUE);
    });

    it('when time is decreased, it should decrease the minutes and set the seconds to 59 when the seconds are equal to 0', () => {
        chronometerService.time.minutes = MAX_TIME;
        chronometerService.mode = LIMITED_TIME_MODE;
        chronometerService.changeTime();
        expect(chronometerService.time.seconds).to.equals(MAX_TIME);
        expect(chronometerService.time.minutes).to.equals(MAX_TIME - 1);
    });

    it('increaseTimeByBonusTime should increase the minutes and seconds by the set time in the time constants', () => {
        chronometerService['timeConstants'] = timeConstants;
        const seconds = chronometerService.time.seconds;
        chronometerService.increaseTimeByBonusTime();
        expect(chronometerService.time.seconds).to.equal(seconds + RANDOM_NUMBER + ONE_SECOND_OFFSET);
    });

    it('decreaseTimeByPenaltyTIme should decrease the minutes and seconds by the set time in the time constants', () => {
        chronometerService['timeConstants'] = timeConstants;
        chronometerService.time.seconds = MAX_TIME;
        chronometerService.mode = LIMITED_TIME_MODE;
        chronometerService.penaliseTime();
        expect(chronometerService.time.seconds).to.equal(MAX_TIME - RANDOM_NUMBER);
    });

    it('increaseTimeByBonusTime should not increase the minutes and seconds by the set time in the time constants if the time hits 02:01', () => {
        chronometerService['timeConstants'] = timeConstants;
        chronometerService.time.minutes = TWO_MINUTES;
        const spy = sinon.spy(chronometerService, <any>'increaseTime');
        chronometerService.increaseTimeByBonusTime();
        expect(chronometerService.time.seconds).to.equal(1);
        expect(chronometerService.time.minutes).to.equal(TWO_MINUTES);
        expect(spy.calledOnce);
    });

    it('decreaseTimeByPenaltyTIme not should decrease the minutes and seconds by the set time in the time constants if the time hits 00:00', () => {
        chronometerService['timeConstants'] = timeConstants;
        chronometerService.time.seconds = 1;
        const spy = sinon.spy(chronometerService, <any>'decreaseTime');
        chronometerService.mode = LIMITED_TIME_MODE;
        chronometerService.penaliseTime();
        expect(chronometerService.time.seconds).to.equal(RESET_VALUE);
        expect(chronometerService.time.minutes).to.equal(RESET_VALUE);
        expect(spy.calledOnce);
    });

    it('setChronometerMode should call limitedTimeMode if the gameMode is Limited Time', () => {
        const spy = sinon.spy(chronometerService, <any>'limitedTimeMode');
        chronometerService.setChronometerMode(LIMITED_TIME_MODE, testSocket);
        expect(spy.calledOnce);
    });

    it('resetSeconds should set seconds to 0', () => {
        chronometerService.time.seconds = MAX_TIME;
        chronometerService['resetSeconds']();
        expect(chronometerService.time.seconds).to.equal(RESET_VALUE);
    });

    it('decreaseMinutes should not decrease the minutes if they are already at 0', () => {
        chronometerService.time.minutes = RESET_VALUE;
        chronometerService['decreaseMinutes']();
        expect(chronometerService.time.minutes).to.equal(RESET_VALUE);
    });

    it('setSeconds should not set the seconds to 59 if the minutes are already at 0', () => {
        chronometerService.time.minutes = RESET_VALUE;
        chronometerService['setSeconds']();
        expect(chronometerService.time.seconds).to.equal(RESET_VALUE);
    });
});
