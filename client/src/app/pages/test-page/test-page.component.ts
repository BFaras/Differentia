import { Component, OnInit, Renderer2 } from '@angular/core';
import { ImageDataToCompare } from '@app/classes/differences-classes/image-data-to-compare';
import { DifferenceDetectorService } from '@app/services/difference-detector-feature/difference-detector.service';
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
    constructor(private renderer: Renderer2,private differenceDetector: DifferenceDetectorService,private imgToimgDifference: ImageToImageDifferenceService) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');

        this.originalImage.src = '../../../assets/ImageBlanche.bmp';
        await this.imgToimgDifference.waitForOriginalImageToLoad();
        this.modifiedImage.src = '../../../assets/ImageDiff.bmp';
        await this.imgToimgDifference.waitForModifiedImageToLoad();

        const imagesDatas: ImageDataToCompare = this.imgToimgDifference.generateImagesDataToCompare(mainCanvas);

        console.log(imagesDatas);
        
        this.differenceDetector.setImageDataToCompare(imagesDatas);
        this.differenceDetector.setOffSet(9);
        this.differenceDetector.generateDifferencesInformation();
        this.differenceDetector.countDifferences();

        this.imgToimgDifference.generateDifferencesImage(mainCanvas, this.finalDifferencesImage);
    }
}
