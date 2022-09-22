/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-imports */
import { Injectable } from '@angular/core';
import { BASE_ONE } from '../../../../common/const';
import { Time } from '../../../../common/time';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    time: Time;

    showableMinutes: string = "";
    showableSeconds: string = "";

    constructor() {}

    classicMode() {
        this.time = {
            minutes: 0,
            seconds: 0,
        };
        this.showableMinutes = '00';
        this.showableSeconds = '00';
    }

    changeTime(newTime: Time) {
        this.time = newTime;
        this.showTime();
    }

    showTime() {
        this.showMinutes();
        this.showSeconds();
    }

    showMinutes() {
        this.showableMinutes = (this.time.minutes < BASE_ONE)? `0${this.time.minutes}`:this.time.minutes.toString();
    }

    showSeconds() {
      this.showableSeconds = (this.time.seconds < BASE_ONE)? `0${this.time.seconds}`:this.time.seconds.toString();
    }
}
