import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
    selector: 'app-pop-dialog-create-game',
    templateUrl: './pop-dialog-create-game.component.html',
    styleUrls: ['./pop-dialog-create-game.component.scss'],
})
export class PopDialogCreateGameComponent implements OnInit {
    numberOfDifference: number
    image:any
    nameOfGame: string;
    constructor(@Inject(MAT_DIALOG_DATA) private imageInfo: any) {}

    ngOnInit(): void {
        this.numberOfDifference = this.imageInfo.numberOfDifferenceReceived
        this.image= this.imageInfo.imageDifference.imageOfDifferenceReceived

    }
}
