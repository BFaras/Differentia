import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication.service';
import { Game } from '@common/game';
@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    image :any
    @ViewChild('name') nameInput: ElementRef;
    nameOfGame: string;
    numberOfDifference: number
    gameToAdd: Game = {
        name: "Car game", // remplacer car game par this.nameOfGame
        numberOfDifferences: 6, // remplacer 6 par this.nbOfDifferences
        times: [],
        images: ['image1','image2','imageDifference'] // index 0 => image orignale, index 1 => image modifiée
    }
    constructor(private communicationService: CommunicationService,@Inject(MAT_DIALOG_DATA) private imagesReceived: any) {}
    

    ngOnInit(): void {
        this.numberOfDifference = this.imagesReceived.numberOfDifferenceReceived
        this.image= this.imagesReceived.imageOfDifferenceReceived

    }

    test() {
        console.log(this.numberOfDifference);
        console.log(this.nameOfGame);
    }

    addGame(gameToAdd: Game) {
        this.gameToAdd = { name: this.nameInput.nativeElement.value,
            numberOfDifferences: this.imagesReceived.numberOfDifferenceReceived , 
            times:[], images : [this.imagesReceived.imagesWithIndexReceived.originalImage
                ,this.imagesReceived.imagesWithIndexReceived.modifiedImage] }
                
        if(this.validateNumberOfDifferences()) {
            this.communicationService
                .addGame(gameToAdd)
                .subscribe((httpStatus: Number) => {
                    this.statusCodeTreatment(httpStatus);
                });
        }
        else console.log("change ton popUp pour dire que le nombre de différences n'est pas entre 3 et 9");
    }

    statusCodeTreatment(responseStatusCode: Number) {
        if(true) console.log("change pop up pour dire que c'est bon");
        else console.log("change pop up pour dire que le nom est répétitif");
    }

    validateNumberOfDifferences() {
        return this.numberOfDifference >= 3 && this.numberOfDifference <= 9;
    }
}
