/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */

import { MAX_TIME, RESET_VALUE, CLASSIC_MODE, LIMITED_TIME_MODE } from '@common/const';
import { Time } from '@common/time';
import { Service } from 'typedi';
import * as io from 'socket.io';

@Service()
export class ChronometerService {
    time: Time = {
        minutes: 0,
        seconds: 0,
    };
    private mode: string;
    
    constructor() {}

    setChronometerMode(gameMode: string, socket: io.Socket): void {
        if (gameMode === LIMITED_TIME_MODE) {
            this.limitedTimeMode(socket);
        } else {
            this.classicMode(socket);
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
        if (this.mode === CLASSIC_MODE) {
            this.increaseTime();
        } else {
            this.decreaseTime();
        }
    }

    private increaseTime() {
        if (this.time.seconds !== MAX_TIME) this.increaseSeconds();
        else {
            this.increaseMinutes();
            this.resetSeconds();
        }
    }

    private decreaseTime() {
        if (this.time.seconds !== RESET_VALUE) this.decreaseSeconds();
        else {
            this.setSeconds();
            this.decreaseMinutes();
        }
    }
    
    private classicMode(socket: io.Socket): void {
        this.resetChrono();
        this.mode = CLASSIC_MODE;
        socket.data.gameMode = CLASSIC_MODE;
    }

    private limitedTimeMode(socket: io.Socket): void {
        this.time.minutes = this.getMinutesFromDatabase();
        this.time.seconds = this.getSecondsFromDatabase();
        this.mode = LIMITED_TIME_MODE;
        socket.data.gameMode = LIMITED_TIME_MODE;
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
