import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopDialogCreateGameComponent } from '../pop-dialog-create-game/pop-dialog-create-game.component';
@Component({
    selector: 'app-pop-dialog-validate-game',
    templateUrl: './pop-dialog-validate-game.component.html',
    styleUrls: ['./pop-dialog-validate-game.component.scss'],
})
export class PopDialogValidateGameComponent implements OnInit {
    isChecked = false
    valueChosen:number = 3;
    numberDifference:number;
    imageDifference:any;
    constructor(private dialog: MatDialog) {}
    ngOnInit(): void {
    }
    onCreateCreateGame() {
        //cette fonction arrive d abord et apres on ouvre dialog
        this.getDifferenceNumberAndImage(this.valueChosen)

        this.dialog.open(PopDialogCreateGameComponent, {
            height: '400px',
            width: '600px',
            data:{
                numberOfDifferenceReceived:this.numberDifference,
                imageOfDifferenceReceived: this.imageDifference
            }
        });
    }

    onRadiusChanged(event:any){
        this.valueChosen = event.value
    }

    getDifferenceNumberAndImage(radius:number){
        // obtenir nombre de difference avec le radius
        this.numberDifference = 100
        this.imageDifference = 0;
    }

}
