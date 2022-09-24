import { Component, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';
import { Game } from '@common/game';
import { StatusCodes } from 'http-status-codes';


@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    
    nameOfGame: string;
    nbOfDifferences: number;
    gameToAdd: Game = {
        name: "Car game", // remplacer car game par this.nameOfGame
        numberOfDifferences: 6, // remplacer 6 par this.nbOfDifferences
        times: [],
        images: [] // index 0 => image orignale, index 1 => image modifiée
    }
    constructor(private communicationService: CommunicationService) {}

    ngOnInit(): void {}

    test() {
        console.log(this.nbOfDifferences);
        console.log(this.nameOfGame);
    }

    addGame(gameToAdd: Game) {
        if(this.validateNumberOfDifferences()) {
            this.communicationService
                .addGame(gameToAdd)
                .subscribe((responseStatusCode: Number) => {
                    this.statusCodeTreatment(responseStatusCode);
                });
        }
        else console.log("change ton popUp pour dire que le nombre de différences n'est pas entre 3 et 9");
    }

    statusCodeTreatment(responseStatusCode: Number) {
        if(responseStatusCode === StatusCodes.CREATED) console.log("change pop up pour dire que c'est bon");
        else console.log("change pop up pour dire que le nom est répétitif");
    }

    validateNumberOfDifferences() {
        return this.nbOfDifferences >= 3 && this.nbOfDifferences <= 9;
    }
}
