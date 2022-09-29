import { Component, Input, OnInit, Renderer2 } from '@angular/core';

import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
// import { imageToSendToServer } from '@common/imageToSendToServer';
import { ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';

@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
    @Input() imagesWithIndexReceived:any ;
    @Input() firstUrl:any
    @Input() secondUrl:any
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();
    
    constructor(private renderer: Renderer2, private imageToImageDifferenceService: ImageToImageDifferenceService ) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');

        const myValueOriginal = unwrapSafeValue(this.firstUrl as SafeValue);
        const myValueModified = unwrapSafeValue(this.secondUrl as SafeValue);

        this.originalImage.src = myValueOriginal;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);
        console.log(this.originalImage.src)

        
        this.modifiedImage.src = myValueModified;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);
    

        this.imageToImageDifferenceService.sendDifferentImagesInformationToServerForGameCreation(
            mainCanvas,
            this.originalImage,
            this.modifiedImage,
            this.finalDifferencesImage,
            0,
        );
    }
}
