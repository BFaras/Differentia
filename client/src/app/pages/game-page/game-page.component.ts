import { Component } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { ADVERSARY_PLR_USERNAME_POS, LOCAL_PLR_USERNAME_POS, MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Game } from '@common/game';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Time } from '@common/time';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    readonly localPlrUseranmePos = LOCAL_PLR_USERNAME_POS;
    nbDifferences: number;
    gameName: string;
    usernames: string[] = [];
    images: HTMLImageElement[];
    nbDifferencesFound: number[] = [0, 0];

    constructor(private socketService: SocketClientService, private timeService: TimeService, private communicationService: CommunicationService) {
        this.images = [new Image(640, 480), new Image(640, 480)];
    }

    ngOnInit() {
        this.socketService.connect();
        this.configureGamePageSocketFeatures();
    }

    ngOnDestroy() {
        this.socketService.send('kill the game');
        this.socketService.disconnect();
    }

    private configureGamePageSocketFeatures() {
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
            this.usernames[LOCAL_PLR_USERNAME_POS] = username;
        });

        this.socketService.on('The adversary username is', (advesaryUsername: string) => {
            this.usernames[ADVERSARY_PLR_USERNAME_POS] = advesaryUsername;
        });

        //To test
        this.socketService.on('Valid click', (differencesInfo: GameplayDifferenceInformations) => {
            if (differencesInfo.isValidDifference) {
                this.incrementPlayerNbOfDifferencesFound(differencesInfo.socketId);
            }
        });

        this.socketService.on('game images', (imagesData: string[]) => {
            this.images[ORIGINAL_IMAGE_POSITION].src = imagesData[ORIGINAL_IMAGE_POSITION];
            this.images[MODIFIED_IMAGE_POSITION].src = imagesData[MODIFIED_IMAGE_POSITION];
        });
    }

    private incrementPlayerNbOfDifferencesFound(socketId: string) {
        if (socketId == this.socketService.socket.id) {
            this.nbDifferencesFound[LOCAL_PLR_USERNAME_POS] += 1;
        } else {
            this.nbDifferencesFound[ADVERSARY_PLR_USERNAME_POS] += 1;
        }
    }

    private receiveNumberOfDifferences(nameGame: string): void {
        firstValueFrom(this.communicationService.getGames()).then((array: Game[]) => {
            let gameWanted = array.find((x) => x.name === nameGame);
            // gameWanted ne sera jamais undefined car le nom utilisé dans le .find est d'un jeu qui
            // existe forcément (il est dans la page de sélection )
            this.nbDifferences = gameWanted ? gameWanted.numberOfDifferences : -1;
        });
    }
}
