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
    time: Time = {
        minutes: 0,
        seconds: 0,
    };
    intervalForTimer: any; // On px mettre quelque chose d'autre que any?
    intervalToCheckTime: any;

    constructor() {}

    private increaseSeconds() {
        this.time.seconds += 1;
    }

    private increaseMinutes() {
        this.time.minutes += 1;
    }

    private resetSeconds() {
        this.time.seconds = 0; // Le mettre dans le fichier des constantes?
    }

    increaseTime() {
        if (this.time.seconds !== MAX_TIME) this.increaseSeconds();
        else {
            this.increaseMinutes();
            this.resetSeconds();
        }
    }

    resetChrono() {
        this.time.minutes = RESET_VALUE;
        this.time.seconds = RESET_VALUE;
    }
}
