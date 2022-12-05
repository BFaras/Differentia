import { Injectable } from '@angular/core';
import { BASE_ONE, EMPTY_SHOWABLE_TIME } from '@app/const/client-consts';
import { Time } from '@common/time';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    time: Time;
    showableMinutes: string = EMPTY_SHOWABLE_TIME;
    showableSeconds: string = EMPTY_SHOWABLE_TIME;

    changeTime(newTime: Time) {
        this.time = newTime;
        this.showTime();
    }

    showTime() {
        this.showMinutes();
        this.showSeconds();
    }

    showMinutes() {
        this.showableMinutes = this.time.minutes < BASE_ONE ? `0${this.time.minutes}` : this.time.minutes.toString();
    }

    showSeconds() {
        this.showableSeconds = this.time.seconds < BASE_ONE ? `0${this.time.seconds}` : this.time.seconds.toString();
    }

    resetTime() {
        this.showableMinutes = EMPTY_SHOWABLE_TIME;
        this.showableSeconds = EMPTY_SHOWABLE_TIME;
    }
}
