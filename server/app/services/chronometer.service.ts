/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */

// Est ce que les disable sont corrects?

import { Time } from '../../../common/time';
import { Service } from 'typedi';
import { MAX_TIME, RESET_VALUE } from '../../../common/const';

@Service()
export class ChronometerService {
    time:Time = {
        minutes: 0,
        seconds: 0,
    };
    intervalForTimer:any; // On px mettre quelque chose d'autre que any?
    intervalToCheckTime:any;

    constructor() {}

    increaseSeconds() {
      this.time.seconds += 1;
    }   

    increaseMinutes() {
      this.time.minutes += 1;
    }

    resetSeconds() {
      this.time.seconds = 0; // Le mettre dans le fichier des constantes?
    }

    increaseTime() {
      if (this.time.seconds !== MAX_TIME)
        this.increaseSeconds();
      else {
        this.increaseMinutes();
        this.resetSeconds();
      }
    }

    // setMinutes(minutesUpdated:number) {
    //   this.time.minutes = minutesUpdated;
    // }
    // // EST CE QUE DE LA DUPLICATION DE CODE PCQ ON FAIT LA MM FONCTION POUR MINUTES ET SECONDES
    // setSeconds(secondsUpdated:number) {
    //   this.time.seconds = secondsUpdated;
    // }

    // showMinutes() {
    //   if(this.time.minutes < BASE_ONE) {
    //     return '0' + this.time.minutes.toString();
    //   }
    //   return this.time.minutes.toString();
    // }

    // showSeconds() {
    //   if(this.time.seconds < BASE_ONE) {
    //     return '0' + this.time.seconds.toString();
    //   }
    //   return this.time.seconds.toString();
    // }

    // checktime() {
    //   if(this.time.seconds === MAX_TIME && this.time.minutes === MAX_TIME) {
    //     this.stopChronometer();  
    //     // this.gameOver();
    //   }
    // }

    // gameOver() {
    //   this.dialogService.openDialog();
    // }

    // startChronometer() {
    //   this.resetChrono();
    //   this.intervalForTimer = setInterval(() =>
    //     this.increaseTime(), ONE_SECOND); 
    //   this.intervalToCheckTime = setInterval(() =>
    //     this.checktime(), HALF_A_SECOND);// Est ce que 1000 est un magic number
    // }

    // stopChronometer() {
    //   clearInterval(this.intervalForTimer);
    //   clearInterval(this.intervalToCheckTime);
    // }
       
    public resetChrono() {
      this.time.minutes = RESET_VALUE;
      this.time.seconds = RESET_VALUE;
    }
}