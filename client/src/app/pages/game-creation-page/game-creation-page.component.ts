import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PopDialogDownloadImagesComponent } from '@app/components/pop-dialogs/pop-dialog-download-images/pop-dialog-download-images.component';
import { PopDialogValidateGameComponent } from '@app/components/pop-dialogs/pop-dialog-validate-game/pop-dialog-validate-game.component';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
@Component({
    selector: 'app-game-creation-page',
    templateUrl: './game-creation-page.component.html',
    styleUrls: ['./game-creation-page.component.scss'],
})
export class GameCreationPageComponent implements OnInit {

    constructor(private dialog: MatDialog,
         private route:Router,private editImageService:ListImagesRenderedService,
         private gameToServerService: GameToServerService ) {
    }

    ngOnInit(): void {

        this.gameToServerService.setOriginalUrlUploaded(undefined,undefined)
        this.gameToServerService.setModifiedUrlUploaded(undefined,undefined)

        this.editImageService.getDataImageMultiple().subscribe((url: any)=>{
            this.gameToServerService.setOriginalUrlUploaded(0,url)
            this.gameToServerService.setModifiedUrlUploaded(1,url)

        })

        this.editImageService.getDataImageSingle().subscribe((dataOfImage: { index: number; url: any; })=>{
            if(dataOfImage.index == 0 ){
                this.gameToServerService.setOriginalUrlUploaded(dataOfImage.index,dataOfImage.url)
            }
            else if(dataOfImage.index == 1){
                this.gameToServerService.setModifiedUrlUploaded(dataOfImage.index,dataOfImage.url)
            }
        })

        this.editImageService.getIdImageToRemove().subscribe((indexImage: number | undefined)=>{

            if (this.gameToServerService.getModifiedImageUploaded().index == indexImage){
                this.gameToServerService.setModifiedUrlUploaded(undefined,undefined)

            }
            else if (this.gameToServerService.getOriginalImageUploaded().index == indexImage){
                this.gameToServerService.setOriginalUrlUploaded(undefined,undefined)
            }   
        })
    }

    verifyTwoImagesUploaded(){
        if (this.gameToServerService.getOriginalImageUploaded().index === undefined || this.gameToServerService.getModifiedImageUploaded().index === undefined){
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
        });


    }
}
