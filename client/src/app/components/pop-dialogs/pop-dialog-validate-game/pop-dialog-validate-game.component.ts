import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { PopDialogCreateGameComponent } from '../pop-dialog-create-game/pop-dialog-create-game.component';
@Component({
    selector: 'app-pop-dialog-validate-game',
    templateUrl: './pop-dialog-validate-game.component.html',
    styleUrls: ['./pop-dialog-validate-game.component.scss'],
})
export class PopDialogValidateGameComponent implements OnDestroy  {
    areImageDifferenceAndNumberDifferenceReady:boolean = false;
    isChecked = true
    isDisabled:boolean ;
    valueChosen:number = 3;
    numberDifference:number;
    imageDifference:any;
    constructor(private dialog: MatDialog,
        private mergeImageDataHandler:MergeImageCanvasHandlerService) {}
    
    ngOnDestroy(): void {
        this.mergeImageDataHandler.resetCanvas()
    }
    onCreateCreateGame() {
        this.dialog.open(PopDialogCreateGameComponent, {
            height: '400px',
            width: '600px',
        });
    }

    startsGeneratingImageDifferenceAndNumberDifference(){
        if(this.valueChosen ){
            this.areImageDifferenceAndNumberDifferenceReady = true;
            this.isChecked = false
        }
    }


    onRadiusChanged(value: number){
        this.valueChosen = value
    }


}
