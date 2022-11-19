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
    mode: string;
    intervalForTimer: any;
    intervalToCheckTime: any;
    
    constructor() {}

    setChronometerMode(gameMode: string): void {
        if (gameMode === 'limited time') {
            this.limitedTimeMode();
        } else {
            this.classicMode();
        }
    }
    
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
            this.setSeconds();
            this.decreaseMinutes();
        }
    }

    hasTheChronoHitZero(): boolean {
        return this.time.minutes === RESET_VALUE && this.time.seconds === RESET_VALUE;
    }
    
    resetChrono() {
        this.time.minutes = RESET_VALUE;
        this.time.seconds = RESET_VALUE;
    }

    changeTime(): void {
        if (this.mode === 'classic mode') {
            this.increaseTime();
        } else {
            this.decreaseTime();
        }
    }
    
    private classicMode(): void {
        this.resetChrono();
        this.mode = 'classic mode';
    }

    private limitedTimeMode(): void {
        this.time.minutes = this.getMinutesFromDatabase();
        this.time.seconds = this.getSecondsFromDatabase();
        this.mode = 'limited time mode';
    }

    private getMinutesFromDatabase(): number {
        // GET MINUTES FROM DTABASE
        return 1;
    }

    private getSecondsFromDatabase(): number {
        // GET SECONDS FROM DATABASE
        return 0;
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
        if (this.time.minutes !== RESET_VALUE) {
            this.time.minutes -= 1;
        }
    }

    private resetSeconds() {
        this.time.seconds = 0;
    }

    private setSeconds() {
        if (this.time.minutes !== RESET_VALUE) {
            this.time.seconds = MAX_TIME;
        }
    }

}
