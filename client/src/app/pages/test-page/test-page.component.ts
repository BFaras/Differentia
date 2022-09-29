import { Component, Input, OnInit, Renderer2 } from '@angular/core';

import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
// import { imageToSendToServer } from '@common/imageToSendToServer';

@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
    @Input() imagesWithIndexReceived:any ;
    @Input() firstUrl:any
    @Input() secondUrl:any
    numberOfDifference:number;
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();
    
    constructor(private renderer: Renderer2, private imageToImageDifferenceService: ImageToImageDifferenceService, private gameToServerService:GameToServerService) {}

    async ngOnInit(): Promise<void> {

        const mainCanvas = this.renderer.createElement('canvas');

        this.originalImage.src = this.firstUrl;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);

        
        this.modifiedImage.src = this.secondUrl;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);
    

        this.imageToImageDifferenceService.socketService.on('game creation nb of differences', (nbOfDiffs: number) => {
            this.numberOfDifference = nbOfDiffs;
            console.log(this.numberOfDifference);
        });

        this.imageToImageDifferenceService.sendDifferentImagesInformationToServerForGameCreation(
            mainCanvas,
            this.originalImage,
            this.modifiedImage,
            this.finalDifferencesImage,
            0,
        );
        

        
    }

    loaded(){
        if ( this.finalDifferencesImage.src != "" && this.numberOfDifference != undefined){
            this.gameToServerService.setNumberDifference(this.numberOfDifference)
            this.gameToServerService.setUrlImageOfDifference(this.finalDifferencesImage.src)

            return true
        }
        else{
            return false
        }
    }

}
