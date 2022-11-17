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
    private listName: string[] = [];
    private listImage: string[] = [];
    gamelist: Game[] = [];
    gameForms: GameFormDescription[] = [];

    constructor(private communicationService: CommunicationService) {}

    async receiveGameInformations() {
        this.resetGameForms();
        await firstValueFrom(this.communicationService.getGames())
            .then((games) => {
                this.gamelist = games;
                this.parseGameList();
            })
            .catch((error: Error) => console.log(error));
    }

    private parseGameList() {
        for (let index = 0; index < this.gamelist?.length; index++) {
            this.fillListGameName(this.gamelist[index].name, this.listName);
            this.fillListGameImage(this.gamelist[index].images[0], this.listImage);
            this.initializeGameForm(index);
        }
    }

    private fillListGameName(gameName: string, listName: string[]) {
        listName.push(gameName);
    }

    private fillListGameImage(gameImage: string, listImage: string[]) {
        listImage.push(gameImage);
    }

    private initializeGameForm(index: number) {
        this.gameForms.push(new GameFormDescription(this.listName[index], this.listImage[index], new RecordTimesBoard([], [])));
    }

    private resetGameForms() {
        this.gameForms = [];
        this.gamelist = [];
        this.listImage = [];
        this.listName = [];
    }
}
