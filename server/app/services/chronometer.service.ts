/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */

import { MAX_TIME, RESET_VALUE } from '@common/const';
import { Time } from '@common/time';
import { Service } from 'typedi';

@Service()
export class ChronometerService {
    time: Time = {
        minutes: 0,
        seconds: 0,
    };
    intervalForTimer: any;
    intervalToCheckTime: any;
    
    constructor() {}

    increaseTime() {
        if (this.time.seconds !== MAX_TIME) this.increaseSeconds();
        else {
            this.increaseMinutes();
            this.resetSeconds();
        }
    }

    decreaseTime() {
        if (this.time.seconds !== RESET_VALUE) this.decreaseSeconds();
        else {
            this.decreaseMinutes();
            this.setSeconds();
        }
    }

    getMinutesFromDatabase(): number {
        // GET MINUTES FROM DTABASE
        return 0;
    }

    getSecondsFromDatabase(): number {
        // GET SECONDS FROM DATABASE
        return 0;
    }

    resetChrono() {
        this.time.minutes = RESET_VALUE;
        this.time.seconds = RESET_VALUE;
    }

    private increaseSeconds() {
        this.time.seconds += 1;
    }

    private increaseMinutes() {
        this.time.minutes += 1;
    }

    private decreaseSeconds() {
        this.time.seconds -= 1;
    }

    private decreaseMinutes() {
        this.time.minutes -= 1;
    }

    private resetSeconds() {
        this.time.seconds = 0;
    }

    private setSeconds() {
        this.time.seconds = MAX_TIME;
    }

}
