import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameToServerService } from '@app/services/game-to-server.service';
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
    constructor(private gameToServerService :GameToServerService ) {}
    

    ngOnInit(): void {
        this.getNumberOfDifference()
    }

    addGame() {
        this.gameToServerService.addGame(this.nameInput)
    }

    getNumberOfDifference(){
        this.numberOfDifference= this.gameToServerService.getNumberDifference()
    }
}
