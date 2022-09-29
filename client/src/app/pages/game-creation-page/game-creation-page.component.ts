import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopDialogDownloadImagesComponent } from '@app/components/pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
import { PopDialogValidateGameComponent } from '@app/components/pop-dialogs/pop-dialog-validate-game/pop-dialog-validate-game.component';
import { imageToSendToServer } from '../../../../../common/imageToSendToServer';
import { EditImagesService } from '../../services/edit-images.service';
@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent implements OnInit {
    firstUrl:any;
    secondUrl:any;
    imageToSend: imageToSendToServer = {
        originalImage : new Image(),
        modifiedImage : new Image(),
        originalIndex : null,
        modifiedIndex :  null

    };
    isValidationDisabled:boolean = true;

    constructor(private dialog: MatDialog, private route:Router,private editImageService:EditImagesService) {
    }

    ngOnInit(): void {

        this.editImageService.getDataImageMultiple().subscribe((url)=>{
            
            this.imageToSend.originalImage.src = url
            this.firstUrl = url;
            this.imageToSend.originalIndex = 0;
            this.imageToSend.modifiedImage.src = url
            this.secondUrl = url;
            this.imageToSend.modifiedIndex = 1;

        })

        this.editImageService.getDataImageSingle().subscribe((dataOfImage)=>{
            if(dataOfImage.index == 0 ){
                
                this.imageToSend.originalImage.src = dataOfImage.url
                this.imageToSend.originalIndex = dataOfImage.index
                this.firstUrl = dataOfImage.url;
            }
            else if(dataOfImage.index == 1){
                
                this.imageToSend.modifiedImage.src = dataOfImage.url
                this.imageToSend.modifiedIndex = dataOfImage.index
                this.secondUrl = dataOfImage.url;
            }
        })

        this.editImageService.getIdImageToRemove().subscribe((indexImage)=>{

            if (this.imageToSend.modifiedIndex == indexImage){
                this.imageToSend.modifiedIndex = null

            }
            else if (this.imageToSend.originalIndex == indexImage){
                this.imageToSend.originalIndex = null

            }
                

        })
    }

    verifyTwoImagesUploaded(){
        if (this.imageToSend.modifiedIndex ==  null || this.imageToSend.originalIndex == null){
            return true;
        }
        else{
            return false
        }
    }

    goToAdmin(){
        this.route.navigate(['/admin'])
        
    }
    onCreateDownloadPopDialog() {
        this.dialog.open(PopDialogDownloadImagesComponent, {
            height: '400px',
            width: '600px',
            data: {
                bothImage: true,
            },
        });
    }

    onCreateValidatePopDialog() {
        this.dialog.open(PopDialogValidateGameComponent, {
            height: '400px',
            width: '600px',
            data: {
                imagesToSend: this.imageToSend,
                FistImageSrc : this.firstUrl,
                SecondImageSrc : this.secondUrl}
        });


    }
}
