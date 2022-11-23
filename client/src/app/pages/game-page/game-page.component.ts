import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ALL_GAMES_FINISHED,
    DISABLE_CLOSE,
    EMPTY_PLAYER_NAME,
    LOSING_FLAG,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
    TIMER_HIT_ZERO_MESSAGE,
    WIN_FLAG,
} from '@app/client-consts';
import { PopDialogEndgameComponent } from '@app/components/pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';
import { CommunicationService } from '@app/services/communication.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { TimeService } from '@app/services/time.service';
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
    readonly localPlrUsernamePos = LOCAL_PLR_USERNAME_POS;
    nbDifferences: number;
    gameName: string;
    gameMode: string;
    usernames: string[] = [];
    isMultiplayerGame: boolean;
    images: HTMLImageElement[];
    nbDifferencesFound: number[] = [0, 0];

    constructor(
        private socketService: SocketClientService,
        private timeService: TimeService,
        private communicationService: CommunicationService,
        private dialog: MatDialog,
    ) {
        this.images = [new Image(IMAGE_WIDTH, IMAGE_HEIGHT), new Image(IMAGE_WIDTH, IMAGE_HEIGHT)];
        this.isMultiplayerGame = false;
    }

    ngOnInit() {
        this.socketService.connect();
        this.configureGamePageSocketFeatures();
    }

    ngOnDestroy() {
        this.socketService.send('kill the game', this.gameMode);
    }

    private openDialog(messageToDisplay: string, winF: boolean): void {
        this.dialog.open(PopDialogEndgameComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            disableClose: DISABLE_CLOSE,
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
            this.gameMode = LIMITED_TIME_MODE;
        });

        this.socketService.on('time', (time: Time) => {
            this.timeService.changeTime(time);
        });

        this.socketService.on('The game is', (gameName: string) => {
            this.receiveNumberOfDifferences(gameName);
            this.gameName = gameName;
        });

        this.socketService.on('show the username', (username: string) => {
            this.usernames[LOCAL_PLR_USERNAME_POS] = username;
        });

        this.socketService.on('The adversary username is', (advesaryUsername: string) => {
            this.usernames[ADVERSARY_PLR_USERNAME_POS] = advesaryUsername;
            this.isMultiplayerGame = true;
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
            this.openDialog(TIMER_HIT_ZERO_MESSAGE, LOSING_FLAG);
        });

        this.socketService.on('no more games available', () => {
            this.openDialog(ALL_GAMES_FINISHED, WIN_FLAG);
        });

        //To test Seb
        this.socketService.on('Other player abandonned LM', (username: string) => {
            this.usernames[ADVERSARY_PLR_USERNAME_POS] = EMPTY_PLAYER_NAME;
            this.isMultiplayerGame = false;
        });
    }
}
