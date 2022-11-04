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

    increaseSeconds() {
        this.time.seconds += 1;
    }

    increaseMinutes() {
        this.time.minutes += 1;
    }

    resetSeconds() {
        this.time.seconds = 0;
    }

    increaseTime() {
        if (this.time.seconds !== MAX_TIME) this.increaseSeconds();
        else {
            this.increaseMinutes();
            this.resetSeconds();
        }
    }

    public resetChrono() {
        this.time.minutes = RESET_VALUE;
        this.time.seconds = RESET_VALUE;
    }
}
