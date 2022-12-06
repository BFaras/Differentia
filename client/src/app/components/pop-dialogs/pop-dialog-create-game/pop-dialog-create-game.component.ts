import { Component, OnInit } from '@angular/core';
import { GameToServerService } from '@app/services/game-to-server.service';
@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    isImageDifferenceAndNumberReady: boolean;
    nameOfGame: string;
    numberOfDifference: number;
    constructor(private gameToServerService: GameToServerService) {}

    ngOnInit(): void {
        this.getNumberOfDifference();
    }

    addGame(): void {
        this.gameToServerService.addGame(this.nameOfGame);
    }

    verifyNoSpace(): boolean {
        if (this.nameOfGame.trim() !== '') {
            return false;
        }
        return true;
    }

    getNumberOfDifference(): void {
        this.numberOfDifference = this.gameToServerService.getNumberDifference();
    }
}
