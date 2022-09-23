/* eslint-disable prettier/prettier */

import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { TimeService } from '@app/services/time.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {

  nbDifferences: number;

  constructor(public timeService: TimeService, public readonly communicationService: CommunicationService) {}

  ngOnInit(): void {
    this.receiveNumberOfDifferences("Jeu 1");
  }

  ngOnDestroy(): void {}

  // sendTimeToServer(): void {
  //   const newScoreMessage: Message = {
  //     title: 'time',
  //     body: this.chronometerService.showMinutes() + ':' + this.chronometerService.showSeconds(),
  //   };
  //     this.communicationService.postTime(newScoreMessage).subscribe();
  // }

  receiveNumberOfDifferences(nameGame: string): void {
    this.communicationService
      .getGames()
      .subscribe((array) => {
        console.log(array);
        let gameWanted = array.find((x) => x.name === nameGame)
        this.nbDifferences = gameWanted? gameWanted.numberOfDifferences: -1;
      });
  }

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
