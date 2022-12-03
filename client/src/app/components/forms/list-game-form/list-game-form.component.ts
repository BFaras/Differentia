import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameFormDescription } from '@app/classes/game-form-description';
import {
    EMPTY_MESSAGE,
    FIRST_GAMEFORMS_INDEX,
    LAST_GAMEFORMS_INDEX,
    RESET_MSG_GAME_LIST,
    SNACKBAR_DURATION,
    SNACKBAR_HORIZONTAL_POSITION,
    SNACKBAR_VERTICAL_POSITION,
} from '@app/const/client-consts';
import { CommunicationService } from '@app/services/communication.service';
import { FormService } from '@app/services/form.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { Constants } from '@common/config';
import { MSG_RESET_ALL_TIME, MSG_RESET_TIME } from '@common/const';

@Component({
    selector: 'app-list-game-form',
    templateUrl: './list-game-form.component.html',
    styleUrls: ['./list-game-form.component.scss'],
})
export class ListGameFormComponent implements OnInit {
    firstElementIndex: number = FIRST_GAMEFORMS_INDEX;
    lastElementIndex: number = LAST_GAMEFORMS_INDEX;
    currentPageGameFormList: GameFormDescription[];
    gameListToRefresh: boolean = true;
    numberOfGames: number;
    reloadState: boolean = true;
    private messageForUpdate: string = EMPTY_MESSAGE;
    private horizontalPosition: MatSnackBarHorizontalPosition = SNACKBAR_HORIZONTAL_POSITION;
    private verticalPosition: MatSnackBarVerticalPosition = SNACKBAR_VERTICAL_POSITION;

    @Input() page: string;

    constructor(
        public formService: FormService,
        private socketService: SocketClientService,
        private snackBar: MatSnackBar,
        private router: Router,
        private communicationService: CommunicationService,
    ) {}

    async ngOnInit() {
        this.config(this.messageForUpdate);
        await this.formService.receiveGameInformations();
        this.reloadState = false;
        if (this.formService.gameForms?.length < Constants.MAX_NB_OF_FORMS_PER_PAGE) {
            this.lastElementIndex = this.formService.gameForms?.length - 1;
        }
        this.addCurrentPageGameForms();
    }

    nextPageGameForms() {
        if (this.firstElementIndex + Constants.MAX_NB_OF_FORMS_PER_PAGE < this.formService.gameForms.length) {
            this.firstElementIndex += Constants.MAX_NB_OF_FORMS_PER_PAGE;

            if (this.lastElementIndex + Constants.MAX_NB_OF_FORMS_PER_PAGE < this.formService.gameForms.length) {
                this.lastElementIndex = this.firstElementIndex + (Constants.MAX_NB_OF_FORMS_PER_PAGE - 1);
            } else {
                this.lastElementIndex = this.formService.gameForms.length - 1;
            }

            this.addCurrentPageGameForms();
        }
    }

    previousPageGameForms() {
        if (this.firstElementIndex - Constants.MAX_NB_OF_FORMS_PER_PAGE >= 0) {
            this.firstElementIndex -= Constants.MAX_NB_OF_FORMS_PER_PAGE;
            this.lastElementIndex = this.firstElementIndex + (Constants.MAX_NB_OF_FORMS_PER_PAGE - 1);

            this.addCurrentPageGameForms();
        }
    }

    private addCurrentPageGameForms() {
        this.currentPageGameFormList = new Array(this.lastElementIndex - this.firstElementIndex + 1);
        for (let index = 0; index < this.currentPageGameFormList.length; index++) {
            this.currentPageGameFormList[index] = this.formService.gameForms[index + this.firstElementIndex];
        }
        this.numberOfGames = this.currentPageGameFormList.length;
    }

    private openSnackBar(gameName: string | string[]) {
        let msg = `Le jeu ${gameName} a été supprimé :(`;
        if (gameName.includes(MSG_RESET_TIME)) {
            msg = gameName.toString();
        }
        if (gameName === MSG_RESET_ALL_TIME) {
            msg = gameName.toString();
        }
        if (Array.isArray(gameName)) {
            msg = RESET_MSG_GAME_LIST;
        }
        this.snackBar.open(msg, 'OK', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: SNACKBAR_DURATION,
        });
    }

    private config(gameName: string) {
        this.socketService.connect();
        this.socketService.send('Reload game selection page', gameName);

        this.socketService.on('Page reloaded', async (message: string | string[]) => {
            if (this.router.url === '/admin' || this.router.url === '/gameSelection') {
                this.openSnackBar(message);
                if (message) {
                    await this.refreshGames(this.gameListToRefresh);
                    this.gameListToRefresh = false;
                }
            }
        });

        this.socketService.on('game list updated', async (value: string) => {
            if (this.socketService.socket.id === value) {
                this.gameListToRefresh = true;
                await this.refreshGames();
            }
        });
    }

    private async refreshGames(reload?: boolean) {
        this.messageForUpdate = EMPTY_MESSAGE;
        this.gameListToRefresh = false;
        this.firstElementIndex = FIRST_GAMEFORMS_INDEX;
        this.lastElementIndex = LAST_GAMEFORMS_INDEX;
        this.nextPageGameForms();
        this.previousPageGameForms();
        if (reload) {
            await this.ngOnInit();
        }
    }

    async deleteAndRefreshGames(gameName: string) {
        this.communicationService.deleteGame(gameName).subscribe((games) => {
            this.formService.gamelist = games;
            this.config(gameName);
        });
    }
}
