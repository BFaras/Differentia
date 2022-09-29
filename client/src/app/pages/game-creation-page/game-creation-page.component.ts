import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopDialogDownloadImagesComponent } from '@app/components/pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
import { PopDialogValidateGameComponent } from '@app/components/pop-dialogs/pop-dialog-validate-game/pop-dialog-validate-game.component';
import { EditImagesService } from '../../services/edit-images.service';
import { ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';

@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent implements OnInit {
    firstUrl:any;
    secondUrl:any;
    isValidationDisabled:boolean = true;
    modifiedIndex : number | null
    originalIndex : null| number

    constructor(private dialog: MatDialog, private route:Router,private editImageService:EditImagesService) {
    }

    ngOnInit(): void {

        this.editImageService.getDataImageMultiple().subscribe((url)=>{
            
            const UnwrapedSafeUrl = unwrapSafeValue(url as SafeValue);
            this.firstUrl = UnwrapedSafeUrl;
            this.originalIndex = 0;

            this.secondUrl = UnwrapedSafeUrl;
            this.modifiedIndex = 1;

        })

        this.editImageService.getDataImageSingle().subscribe((dataOfImage)=>{
            if(dataOfImage.index == 0 ){
                
                this.originalIndex = dataOfImage.index
                const unwrapedSafeUrl = unwrapSafeValue(dataOfImage.url as SafeValue);
                this.firstUrl = unwrapedSafeUrl;
            }
            else if(dataOfImage.index == 1){
                
                this.modifiedIndex = dataOfImage.index
                const unwrapedSafeUrl = unwrapSafeValue(dataOfImage.url as SafeValue);
                this.secondUrl = unwrapedSafeUrl;
            }
        })

        this.editImageService.getIdImageToRemove().subscribe((indexImage)=>{

            if (this.modifiedIndex == indexImage){
                this.modifiedIndex = null

            }
            else if (this.originalIndex == indexImage){
                this.originalIndex = null

            }
                

        })
    }

    verifyTwoImagesUploaded(){
        if (this.modifiedIndex ==  null || this.originalIndex == null){
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
                firstImageIndex: this.originalIndex,
                fistImageSrc : this.firstUrl,
                secondImageSrc : this.secondUrl,
                secondImageIndex : this.modifiedIndex
            
            }
        });


    }
}
