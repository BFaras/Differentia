import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { imageToSendToServer } from '@common/imageToSendToServer';
import { PopDialogCreateGameComponent } from '../pop-dialog-create-game/pop-dialog-create-game.component';
@Component({
    selector: 'app-pop-dialog-validate-game',
    templateUrl: './pop-dialog-validate-game.component.html',
    styleUrls: ['./pop-dialog-validate-game.component.scss'],
})
export class PopDialogValidateGameComponent  {
    areImageDifferenceAndNumberDifferenceReady:boolean;
    isChecked = false
    isDisabled:boolean ;
    valueChosen:number = 3;
    numberDifference:number;
    imageDifference:any;
    constructor(private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public imagesWithIndexReceived: any) {}
    
    onCreateCreateGame() {
        this.dialog.open(PopDialogCreateGameComponent, {
            height: '400px',
            width: '600px',
            data:{
                numberOfDifferenceReceived:this.numberDifference,
                imageOfDifferenceReceived: this.imageDifference,
                imagesWithIndexReceived : this.imagesWithIndexReceived
            }
        });
    }

    startsGeneratingImageDifferenceAndNumberDifference(){
        if(this.valueChosen != null){
            this.areImageDifferenceAndNumberDifferenceReady = true;
        } else 
        {
        this.areImageDifferenceAndNumberDifferenceReady = false;
        }
    }


    onRadiusChanged(event:any){
        this.valueChosen = event.value
    }


}
