import { Injectable } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';
import { Game } from '@common/game';
import { GameModeTimes } from '@common/games-record-times';
import { firstValueFrom } from 'rxjs';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    private listName: string[] = [];
    private listImage: string[] = [];
    private listTimes: GameModeTimes[] = [];
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

    //  test à finir
    private parseGameList() {
        for (let index = 0; index < this.gamelist?.length; index++) {
            this.fillListGameName(this.gamelist[index].name, this.listName);
            this.fillListGameImage(this.gamelist[index].images[0], this.listImage);
            this.fillListGameTimes(this.gamelist[index].times, this.listTimes);
            this.initializeGameForm(index);
        }
    }

    private fillListGameName(gameName: string, listName: string[]) {
        listName.push(gameName);
    }

    private fillListGameImage(gameImage: string, listImage: string[]) {
        listImage.push(gameImage);
    }
     //To test
    private fillListGameTimes(gameTimes:GameModeTimes, listTimes: GameModeTimes[]) {
        listTimes.push(gameTimes);
    }

    private initializeGameForm(index: number) {
        // this.socketService.send('Need recordTimes', this.listName[index]);
        // this.socketService.on('Send Record Times', (gameRecordTimes: GameModeTimes) => {
        //     this.gameForms.push(
        //         new GameFormDescription(
        //             this.listName[index],
        //             this.listImage[index],
        //             new RecordTimesBoard(gameRecordTimes.soloGameTimes, gameRecordTimes.multiplayerGameTimes),
        //         ),
        //     );
        // });
         this.gameForms.push(new GameFormDescription(this.listName[index], this.listImage[index], new RecordTimesBoard(this.listTimes[index].soloGameTimes,this.listTimes[index].multiplayerGameTimes)));
    }

    private resetGameForms() {
        this.gameForms = [];
        this.gamelist = [];
        this.listImage = [];
        this.listName = [];
        this.listTimes = [];
    }
}
