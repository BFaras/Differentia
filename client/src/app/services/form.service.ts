import { Injectable } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { Game } from '@common/game';
import { firstValueFrom } from 'rxjs';
import { CommunicationService } from './communication.service';
@Injectable({
    providedIn: 'root',
})
export class FormService {
    listName: string[] = [];
    listImage: string[] = [];
    gamelist: Game[] = [];
    gameForms: GameFormDescription[] = [];
    gameToDelete: string = '';

    constructor(private communicationService: CommunicationService) {}

    async receiveGameInformations() {
        this.resetGameForms();
        await firstValueFrom(this.communicationService.getGames())
            .then((games) => {
                this.gamelist = games;
                this.parseGameList();
            })
            .catch((error: Error) => console.log(error));
        console.log('apres receive');
    }

    parseGameList() {
        for (let index = 0; index < this.gamelist?.length; index++) {
            this.fillListGameName(this.gamelist[index].name, this.listName);
            this.fillListGameImage(this.gamelist[index].images[0], this.listImage);
            this.initializeGameForm(index);
        }
    }

    fillListGameName(gameName: string, listName: string[]) {
        listName.push(gameName);
    }

    fillListGameImage(gameImage: string, listImage: string[]) {
        listImage.push(gameImage);
    }

    initializeGameForm(index: number) {
        this.gameForms.push(new GameFormDescription(this.listName[index], this.listImage[index], new RecordTimesBoard([], [])));
    }

    resetGameForms() {
        this.gameForms = [];
        this.gamelist = [];
        this.listImage = [];
        this.listName = [];
    }

    deleteGameForm() {
        this.communicationService.deleteGame(this.gameToDelete).subscribe(async (games) => {
            this.gamelist = games;
            location.reload();
        });
    }
}
