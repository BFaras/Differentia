/* eslint-disable prettier/prettier */

import { Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { TimeService } from '@app/services/time.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {

  @Input() numberOfDifferences: number;

  constructor(public timeService: TimeService, public readonly communicationService: CommunicationService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  // sendTimeToServer(): void {
  //   const newScoreMessage: Message = {
  //     title: 'time',
  //     body: this.chronometerService.showMinutes() + ':' + this.chronometerService.showSeconds(),
  //   };
  //     this.communicationService.postTime(newScoreMessage).subscribe();
  // }

  // receiveNumberOfDifferences(nameGame: string): void {
  //   this.communicationService
  //     .getGames()
  //     .subscribe((array) => {
  //       console.log(array);
  //       let gameWanted = array.find((x) => x.name === nameGame)
  //       // gameWanted ne sera jamais undefined car le nom utilisé dans le .find est d'un jeu qui existe forcément (il est dans la page de sélection )
  //       this.nbDifferences = gameWanted? gameWanted.numberOfDifferences: -1;
  //     });
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
