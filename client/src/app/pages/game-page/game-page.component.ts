import { Component } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Game } from '@common/game';
import { Time } from '@common/time';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    //private mainCanvas: HTMLCanvasElement;
    nbDifferences: number;
    gameName: string;
    username: string;
    images: HTMLImageElement[];
    nbDifferrencesFound: number = 0;

    constructor(public socketService: SocketClientService, private timeService: TimeService, private communicationService: CommunicationService) {
        this.images = [new Image(640, 480), new Image(640, 480)];
    }

    ngOnInit() {
        // this.mainCanvas = this.renderer.createElement('canvas');
        this.socketService.connect();
        this.configureGamePageSocketFeatures();
    }

    ngOnDestroy() {
        this.socketService.send('kill the timer');
        this.socketService.disconnect();
    }

    configureGamePageSocketFeatures() {
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
        this.socketService.on('show the username', (username: string) => {
            this.username = username;
        });
        this.socketService.on('Name repeated', () => {
            console.log('le nom est répété ');
        });

        this.socketService.on('classic solo images', (imagesData: string[]) => {
            this.images[ORIGINAL_IMAGE_POSITION].src = imagesData[ORIGINAL_IMAGE_POSITION];
            this.images[MODIFIED_IMAGE_POSITION].src = imagesData[MODIFIED_IMAGE_POSITION];
        });
    }

    receiveNumberOfDifferences(nameGame: string): void {
        firstValueFrom(this.communicationService.getGames()).then((array: Game[]) => {
            let gameWanted = array.find((x) => x.name === nameGame);
            // gameWanted ne sera jamais undefined car le nom utilisé dans le .find est d'un jeu qui
            // existe forcément (il est dans la page de sélection )
            this.nbDifferences = gameWanted ? gameWanted.numberOfDifferences : -1;
        });
    }
}
