import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameFormDescription } from '@app/classes/game-form-description';
import { CommunicationService } from '@app/services/communication.service';
import { FormService } from '@app/services/form.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { Constants } from '@common/config';

@Component({
    selector: 'app-list-game-form',
    templateUrl: './list-game-form.component.html',
    styleUrls: ['./list-game-form.component.scss'],
})
export class ListGameFormComponent implements OnInit {
    firstElementIndex: number = 0;
    lastElementIndex: number = 3;
    currentPageGameFormList: GameFormDescription[];
    gameListToRefresh: boolean = true;
    private messageForUpdate: string = '';
    private horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    private verticalPosition: MatSnackBarVerticalPosition = 'top';
    private durationInSeconds = 4;

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
        for (let index: number = 0; index < this.currentPageGameFormList.length; index++) {
            this.currentPageGameFormList[index] = this.formService.gameForms[index + this.firstElementIndex];
        }
    }
    private config(gameName: string) {
        this.socketService.connect();
        this.socketService.send('Reload game selection page', gameName);

        this.socketService.on('Page reloaded', async (message) => {
            if (this.router.url === '/admin' || this.router.url === '/gameSelection') {
                this.snackBar.open('Le jeu ' + message + ' a été supprimé :(', 'OK', {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: this.durationInSeconds * 1000,
                });
                await this.refreshGames(this.gameListToRefresh);
                this.gameListToRefresh = true;
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
        this.messageForUpdate = '';
        this.gameListToRefresh = false;
        this.firstElementIndex = 0;
        this.lastElementIndex = 3;
        if (reload) {
            await this.ngOnInit();
        }
    }

    async deleteAndRefreshGames(gameName: string) {
        this.communicationService.deleteGame(gameName).subscribe((games) => {
            this.messageForUpdate = gameName;
            this.formService.gamelist = games;
            this.config(this.messageForUpdate);
        });
    }
}
