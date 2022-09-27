import { Component, OnInit, Renderer2 } from '@angular/core';

import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';

@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();
    constructor(private renderer: Renderer2, private imageToImageDifferenceService: ImageToImageDifferenceService) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');

        this.originalImage.src = '../../../assets/ImageBlanche.bmp';
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);
        this.modifiedImage.src = '../../../assets/image_7_diff.bmp';
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);

        this.imageToImageDifferenceService.sendDifferentImagesInformationToServer(
            mainCanvas,
            this.originalImage,
            this.modifiedImage,
            this.finalDifferencesImage,
            3,
        );
    }
}
