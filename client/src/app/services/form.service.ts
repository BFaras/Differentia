import { Injectable } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { Game } from '@common/game';
import { Subject } from 'rxjs';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    listName: string[] = [];
    listImage: string[] = [];

    gameForms: GameFormDescription[] = [];
    gamesLoadedSubject = new Subject();

    constructor(private communicationService: CommunicationService) {
        this.receiveGameInformations();
    }

    receiveGameInformations() {
        this.communicationService.getGames().subscribe((gamelist: Game[]) => {
            this.parseGameList(gamelist);
            this.gamesLoadedSubject.next(true);
        });
    }

    parseGameList(gamelist: Game[]) {
        for (let index = 0; index < gamelist.length; index++) {
            this.fillListGameName(gamelist[index].name, this.listName);
            this.fillListGameImage(gamelist[index].images[0], this.listImage);
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
}
