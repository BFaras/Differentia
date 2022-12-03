import { MAX_LIMITED_TIME_MINUTES, ONE_MINUTE_IN_SECONDS, ONE_SECOND_OFFSET } from '@app/server-consts';
import { CLASSIC_MODE, LIMITED_TIME_MODE, MAX_TIME, RESET_VALUE } from '@common/const';
import { Time } from '@common/time';
import { TimeConstants } from '@common/time-constants';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { TimeConstantsService } from './time-constants.service';

@Service()
export class ChronometerService {
    time: Time = {
        minutes: 0,
        seconds: 0,
    };
    mode: string;
    private timeConstants: TimeConstants;
    private timeConstantsService: TimeConstantsService = new TimeConstantsService();

    constructor() {}

    async setChronometerMode(gameMode: string, socket: io.Socket): Promise<void> {
        if (gameMode === LIMITED_TIME_MODE) {
            await this.limitedTimeMode(socket);
        } else {
            await this.classicMode(socket);
        }
    }

    hasTheChronoHitZero(): boolean {
        return this.time.minutes === RESET_VALUE && this.time.seconds === RESET_VALUE;
    }

    resetChrono(): void {
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

    increaseTimeByBonusTime(): void {
        for (let i = 0; i < this.timeConstants.savedTime + ONE_SECOND_OFFSET; i++) {
            if (this.time.minutes === MAX_LIMITED_TIME_MINUTES && this.time.seconds === 1) i = this.timeConstants.savedTime;
            else this.increaseTime();
        }
    }

    penaliseTime(): void {
        for (let i = 0; i < this.timeConstants.penaltyTime; i++) {
            if (this.time.minutes === 0 && this.time.seconds === 0 && this.mode === LIMITED_TIME_MODE) i = this.timeConstants.penaltyTime;
            else this.changeTime();
        }
    }

    private increaseTime(): void {
        if (this.time.seconds !== MAX_TIME) this.increaseSeconds();
        else {
            this.increaseMinutes();
            this.resetSeconds();
        }
    }

    private decreaseTime(): void {
        if (this.time.seconds !== RESET_VALUE) this.decreaseSeconds();
        else {
            this.setSeconds();
            this.decreaseMinutes();
        }
    }

    private async classicMode(socket: io.Socket): Promise<void> {
        await this.setConstants();
        this.resetChrono();
        this.mode = CLASSIC_MODE;
        socket.data.gameMode = CLASSIC_MODE;
    }

    private async limitedTimeMode(socket: io.Socket): Promise<void> {
        await this.setConstants();
        this.time.minutes = this.getMinutesFromDatabase();
        this.time.seconds = this.getSecondsFromDatabase();
        this.mode = LIMITED_TIME_MODE;
        socket.data.gameMode = LIMITED_TIME_MODE;
    }

    private async setConstants(): Promise<void> {
        this.timeConstants = await this.timeConstantsService.getTimes();
    }

    private getMinutesFromDatabase(): number {
        return Math.floor(this.timeConstants.initialTime / ONE_MINUTE_IN_SECONDS);
    }

    private getSecondsFromDatabase(): number {
        return this.timeConstants.initialTime % ONE_MINUTE_IN_SECONDS;
    }

    private increaseSeconds(): void {
        this.time.seconds += 1;
    }

    private increaseMinutes(): void {
        this.time.minutes += 1;
    }

    private decreaseSeconds(): void {
        this.time.seconds -= 1;
    }

    private decreaseMinutes(): void {
        if (this.time.minutes !== RESET_VALUE) {
            this.time.minutes -= 1;
        }
    }

    private resetSeconds(): void {
        this.time.seconds = 0;
    }

    private setSeconds(): void {
        if (this.time.minutes !== RESET_VALUE) {
            this.time.seconds = MAX_TIME;
        }
    }
}
