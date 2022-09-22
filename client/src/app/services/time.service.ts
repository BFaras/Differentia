/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-imports */
import { Injectable } from '@angular/core';
import { BASE_ONE } from '../../../../common/const';
import { Time } from '../../../../common/time';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  // readonly time: Subject<Time> = new Subject<Time>();
  // minutes: number;
  // seconds: number;
  // constructor() {}

  // showMinutes() {
  //   if(Time.minutes < BASE_ONE) {
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

}