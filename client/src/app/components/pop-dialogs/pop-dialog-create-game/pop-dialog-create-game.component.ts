import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication.service';
import { Game } from '@common/game';
//import { StatusCodes } from 'http-status-codes';
@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    image: any;
    nameOfGame: string;
    numberOfDifference: number;
    gameToAdd: Game = {
        name: 'new game', // remplacer car game par this.nameOfGame
        numberOfDifferences: 6, // remplacer 6 par this.nbOfDifferences
        times: [],
        images: ['image1', 'image2'], // index 0 => image orignale, index 1 => image modifiée
    };
    constructor(private communicationService: CommunicationService, @Inject(MAT_DIALOG_DATA) private imageInfo: any) {}

    ngOnInit(): void {
        this.numberOfDifference = this.imageInfo.numberOfDifferenceReceived;
        this.image = this.imageInfo.imageDifference.imageOfDifferenceReceived;
    }

    test() {
        console.log(this.numberOfDifference);
        console.log(this.nameOfGame);
    }

    addGame(gameToAdd: Game) {
        if (this.validateNumberOfDifferences()) {
            this.communicationService.addGame(gameToAdd).subscribe((res) => {
                if (res) {
                    //this.statusCodeTreatment(res.status);
                } else {
                    //this.statusCodeTreatment(StatusCodes.BAD_REQUEST);
                }
            });
        } else console.log("change ton popUp pour dire que le nombre de différences n'est pas entre 3 et 9");
    }

    statusCodeTreatment(responseStatusCode: Number) {
        if (true) console.log("change pop up pour dire que c'est bon");
        else console.log('change pop up pour dire que le nom est répétitif');
    }

    validateNumberOfDifferences() {
        return this.numberOfDifference >= 3 && this.numberOfDifference <= 9;
    }
}
