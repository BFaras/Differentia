/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */

// Est ce que les disable sont corrects?

import { MAX_TIME, RESET_VALUE } from '@common/const';
import { Time } from '@common/time';
import { Service } from 'typedi';

@Service()
export class ChronometerService {
    listOfChronometers = new Map<string, Time>;

    constructor() {}

    increaseSeconds(index: string) {
        this.listOfChronometers[index].seconds += 1;
    }

    increaseMinutes(index: string) {
        this.listOfChronometers[index].minutes += 1;
    }

    resetSeconds(index: string) {
        this.listOfChronometers[index].seconds = RESET_VALUE;
    }

    increaseTime(index: string) {
        if (this.listOfChronometers[index].seconds !== MAX_TIME) this.increaseSeconds(index);
        else {
            this.increaseMinutes(index);
            this.resetSeconds(index);
        }
    }

    public resetChrono(index: string) {
        this.listOfChronometers[index].minutes = RESET_VALUE;
        this.listOfChronometers[index].seconds = RESET_VALUE;
    }

    public startChrono(index: string) {
        let newTime: Time = {
            minutes: 0,
            seconds: 0
        };
        this.listOfChronometers[index] = newTime;
    }
}
