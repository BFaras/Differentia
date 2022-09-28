import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { imageToSendToServer } from '@common/imageToSendToServer';
import { PopDialogCreateGameComponent } from '../pop-dialog-create-game/pop-dialog-create-game.component';
@Component({
    selector: 'app-pop-dialog-validate-game',
    templateUrl: './pop-dialog-validate-game.component.html',
    styleUrls: ['./pop-dialog-validate-game.component.scss'],
})
export class PopDialogValidateGameComponent  {
    isChecked = false
    isDisabled:boolean ;
    valueChosen:number = 3;
    numberDifference:number;
    imageDifference:any;
    constructor(private dialog: MatDialog,@Inject(MAT_DIALOG_DATA) private imagesWithIndexReceived: imageToSendToServer ) {}
    
    onCreateCreateGame() {
        this.setImageAndNumberDiffeence()
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

    sendBothImages(){
        //http-request to send
        this.imagesWithIndexReceived.modifiedImage;
    }

    receiveImageDifferenceAndNumberDifference(){
        //http-request to receive images
    }

    setImageAndNumberDiffeence(){
        this.numberDifference = 6;
        this.imageDifference = "imageDifference";
    }


    onRadiusChanged(event:any){
        this.valueChosen = event.value
    }


}
