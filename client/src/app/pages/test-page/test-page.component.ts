import { Component, Input, OnInit, Renderer2, ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';


@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
    @Input() offset:number;
    numberOfDifference: number;
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();

    constructor(
        private renderer: Renderer2,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private gameToServerService: GameToServerService,
    ) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');

        const unwrapedOriginalModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getOriginalImageUploaded().image as SafeValue);
        const unwrapedModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getModifiedImageUploaded().image as SafeValue);

        this.originalImage.src = unwrapedOriginalModifiedSafeUrl;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);

        this.modifiedImage.src = unwrapedModifiedSafeUrl;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);

        this.imageToImageDifferenceService.sendDifferentImagesInformationToServerForGameCreation(
            mainCanvas,
            this.originalImage,
            this.modifiedImage,
            this.finalDifferencesImage,
            this.offset,
        );
    }

    loaded() {
        if (this.finalDifferencesImage.src !== '' ) {
            this.imageToImageDifferenceService.socketService.on('game creation nb of differences', (nbOfDiffs: number) => {
                this.numberOfDifference = nbOfDiffs;
                console.log('numberOfDifferences obtained in socket');
            });
                if (this.numberOfDifference !== undefined){
                this.gameToServerService.setNumberDifference(this.numberOfDifference);
                this.gameToServerService.setUrlImageOfDifference(this.finalDifferencesImage.src);
                }

            return true;
        } else {
            return false;
        }
    }
}
