import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication.service';
import { GameToServerService } from '@app/services/game-to-server.service';
import { Game } from '@common/game';
@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    isImageDifferenceAndNumberReady:boolean;
    imageOfDifferenceSrc :any
    @ViewChild('name') nameInput: ElementRef;
    nameOfGame: string;
    numberOfDifference: number
    gameToAdd: Game = {
        name: "Car game", // remplacer car game par this.nameOfGame
        numberOfDifferences: 6, // remplacer 6 par this.nbOfDifferences
        times: [],
        images: ['image1','image2','imageDifference'], // index 0 => image orignale, index 1 => image modifiée
    }
    constructor(private communicationService: CommunicationService,@Inject(MAT_DIALOG_DATA) private imagesReceived: any,private gameToServerService :GameToServerService ) {}
    

    ngOnInit(): void {
        this.numberOfDifference = this.gameToServerService.getNumberDifference()
        this.imageOfDifferenceSrc= this.gameToServerService.getUrlImageOfDifferences()
        console.log(this.imageOfDifferenceSrc)

    }

    test() {
        console.log(this.numberOfDifference);
        console.log(this.nameOfGame);
    }
    addGame(gameToAdd: Game) {
        this.gameToAdd = { name: this.nameInput.nativeElement.value,
            numberOfDifferences: this.imagesReceived.numberOfDifferenceReceived , 
            times:[], images : [this.imagesReceived.imagesWithIndexReceived.fistImageSrc
                ,this.imagesReceived.imagesWithIndexReceived.secondImageSrc,
                this.imageOfDifferenceSrc] }
                
        if(this.validateNumberOfDifferences()) {
            this.communicationService
                .addGame(gameToAdd)
                .subscribe((httpStatus: Number) => {
                    this.statusCodeTreatment(httpStatus);
                });
        }
        else alert("Attention!! le nombre de difference n'est pas entre 3 et 9");
    }

    statusCodeTreatment(responseStatusCode: Number) {
        if(true) alert("le jeu n'a pas été créer");
        else alert("Le jeu a été créer ");
    }

    validateNumberOfDifferences() {
        return this.numberOfDifference >= 3 && this.numberOfDifference <= 9;
    }
}
