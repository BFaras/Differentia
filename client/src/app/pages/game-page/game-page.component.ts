import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogEndgameComponent } from '@app/components/pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';
import { CommunicationService } from '@app/services/communication.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
import { TIMER_HIT_ZERO_MESSAGE } from '@app/client-consts';
import {
    ADVERSARY_PLR_USERNAME_POS,
    CLASSIC_MODE,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
    LIMITED_TIME_MODE,
    LOCAL_PLR_USERNAME_POS,
    MODIFIED_IMAGE_POSITION,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
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
    gameMode: string;
    usernames: string[] = [];
    images: HTMLImageElement[];
    nbDifferencesFound: number[] = [0, 0];

    constructor(
        private socketService: SocketClientService,
        private timeService: TimeService,
        private communicationService: CommunicationService,
        private dialog: MatDialog,
    ) {
        this.images = [new Image(IMAGE_WIDTH, IMAGE_HEIGHT), new Image(IMAGE_WIDTH, IMAGE_HEIGHT)];
    }

    ngOnInit() {
        this.socketService.connect();
        this.configureGamePageSocketFeatures();
    }

    ngOnDestroy() {
        this.socketService.send('kill the game', this.gameMode);
        // this.socketService.disconnect();
    }

    private openDialog(messageToDisplay: string, winF: boolean): void {
        this.dialog.open(PopDialogEndgameComponent, {
            height: '400px',
            width: '600px',
            disableClose: true,
            data: {
                message: messageToDisplay,
                winFlag: winF,
            },
        });
    }

    private incrementPlayerNbOfDifferencesFound(socketId: string) {
        if (socketId === this.socketService.socket.id) {
            this.nbDifferencesFound[LOCAL_PLR_USERNAME_POS] += 1;
        } else {
            this.nbDifferencesFound[ADVERSARY_PLR_USERNAME_POS] += 1;
        }
    }

    private receiveNumberOfDifferences(nameGame: string): void {
        firstValueFrom(this.communicationService.getGames()).then((array: Game[]) => {
            const gameWanted = array.find((x) => x.name === nameGame);
            // gameWanted ne sera jamais undefined car le nom utilisé dans le .find est d'un jeu qui
            // existe forcément (il est dans la page de sélection )
            this.nbDifferences = gameWanted ? gameWanted.numberOfDifferences : -1; // METTRE LE -1 DANS UNE CONSTANTE
        });
    }

    private configureGamePageSocketFeatures() {
        this.socketService.on(CLASSIC_MODE, () => {
            this.gameMode = CLASSIC_MODE;
        });

        this.socketService.on(LIMITED_TIME_MODE, () => {
            console.log('recu le LIMITED TIME MODE EVETN');
            this.gameMode = LIMITED_TIME_MODE;
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

        this.socketService.on('Valid click', (differencesInfo: GameplayDifferenceInformations) => {
            if (differencesInfo.isValidDifference) {
                this.incrementPlayerNbOfDifferencesFound(differencesInfo.socketId);
            }
        });

        this.socketService.on('game images', (imagesData: string[]) => {
            this.images[ORIGINAL_IMAGE_POSITION].src = imagesData[ORIGINAL_IMAGE_POSITION];
            this.images[MODIFIED_IMAGE_POSITION].src = imagesData[MODIFIED_IMAGE_POSITION];
        });

        this.socketService.on('time hit zero', () => {
            this.openDialog(TIMER_HIT_ZERO_MESSAGE, false);
        });

        this.socketService.on('no more games available', () => {
            this.openDialog('Vous avez fini tous les jeux disponibles! Vous avez gagné!', true); // Remplacer par des constantes
        });
    }
}
