/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */

import { Component, OnInit } from '@angular/core';
import { TimeService } from '@app/services/time.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {

  constructor(public timeService: TimeService) {}

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
