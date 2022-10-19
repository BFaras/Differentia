import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Game } from '@common/game';
import { Time } from '@common/time';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-game-page-onevone',
    templateUrl: './game-page-onevone.component.html',
    styleUrls: ['./game-page-onevone.component.scss'],
})
export class GamePageOnevoneComponent implements OnInit {
    nbDifferences: number = 0;
    gameName: string = 'defaultGameName';
    userNamePlayerA: string = 'defaultUserName';
    userNamePlayerB: string = 'defaultUserName';
    images: HTMLImageElement[];
    nbDifferencesFoundPlayerA: number = 0;
    nbDifferencesFoundPlayerB: number = 0;

    constructor(public socketService: SocketClientService, private timeService: TimeService, private communicationService: CommunicationService) {
        this.images = [new Image(640, 480), new Image(640, 480)];
    }

    ngOnInit(): void {
        this.socketService.connect();
    }

    ngOnDestroy() {
        this.socketService.send('kill the game');
        this.socketService.disconnect();
    }

    configureGamePageOneVOneSocketFeatures() {
        this.socketService.on('classic mode', () => {
            this.timeService.classicMode();
        });
        this.socketService.on('time', (time: Time) => {
            this.timeService.changeTime(time);
        });
        this.socketService.on('The game is', (message: string) => {
            this.receiveNumberOfDifferences(message);
            this.gameName = message;
        });
        this.socketService.on('show the users', (usernames: string[]) => {
            this.userNamePlayerA = usernames[0];
            this.userNamePlayerB = usernames[1];
        });
        this.socketService.on('classic 1v1 images', (imagesData: string[]) => {
            this.images[ORIGINAL_IMAGE_POSITION].src = imagesData[ORIGINAL_IMAGE_POSITION];
            this.images[MODIFIED_IMAGE_POSITION].src = imagesData[MODIFIED_IMAGE_POSITION];
        });
    }

    receiveNumberOfDifferences(nameGame: string) {
        firstValueFrom(this.communicationService.getGames()).then((array: Game[]) => {
            let gameWanted = array.find((x) => x.name === nameGame);
            this.nbDifferences = gameWanted ? gameWanted.numberOfDifferences : -1;
        });
    }
}
