/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */

import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  
  time: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-shadow
  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  // sendTimeToServer(): void {
  //   const newScoreMessage: Message = {
  //     title: 'time',
  //     body: this.chronometerService.showMinutes() + ':' + this.chronometerService.showSeconds(),
  //   };
  //     this.communicationService.postTime(newScoreMessage).subscribe();
  // }

  // receiveTime(): void {
  //   this.communicationService
  //     .getTime()
  //     .pipe(
  //       map((message: Message) => {
  //         return `${message.body.split(':')[0]}:${message.body.split(':')[1]}`;
  //       }),
  //      )
  //     .subscribe(this.time);
  // }

  // receiveNumberOfDifferences(): void {
  //   this.communicationService
  //     .getNumberOfDifferences()
  //     .pipe(
  //       map((message: Message) => {
  //         return `${message.body}`;
  //       }),
  //     )
  //     .subscribe(this.time);
  // }

}
