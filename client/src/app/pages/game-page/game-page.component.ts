/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-imports */
import { Time } from '../../../../../common/time';
import { Component } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { CommunicationService } from '@app/services/communication.service';
import { TimeService } from '@app/services/time.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {

    nbDifferences: number;
    gameName: string;

    constructor(public socketService: SocketClientService, 
        private timeService: TimeService,
        private communicationService: CommunicationService
    ) {}

    ngOnInit() {
        this.socketService.connect();
        this.configureGamePageSocketFeatures();
    }

    ngOnDestroy() {
        this.socketService.send("kill the timer");
    }

    configureGamePageSocketFeatures() {
        this.socketService.on("classic mode", (message: string) => {
            this.timeService.classicMode();
        });
        this.socketService.on("time", (time: Time) => {
            this.timeService.changeTime(time);
        });
        this.socketService.on("The game is", (message: string) => {
            this.receiveNumberOfDifferences(message);
            this.gameName = message;
        })
        this.socketService.on("Name repeated", () => {
            console.log("le nom est répété ");
        })
    }

    receiveNumberOfDifferences(nameGame: string): void {
        this.communicationService
          .getGames()
          .subscribe((array) => {
            console.log("on a recu: " + array);
            let gameWanted = array.find((x) => x.name === nameGame)
            // gameWanted ne sera jamais undefined car le nom utilisé dans le .find est d'un jeu qui 
            // existe forcément (il est dans la page de sélection )
            this.nbDifferences = gameWanted? gameWanted.numberOfDifferences: -1;
          });
    }
}
