import { Component, OnInit, Renderer2 } from '@angular/core';
import { DifferencesDetector } from '@app/classes/differences-classes/differences-detector';
import { DifferencesImageGenerator } from '@app/classes/differences-classes/differences-image-generator';
import { ImageDataToCompare } from '@app/classes/differences-classes/image-data-to-compare';

@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
})
export class TestPageComponent implements OnInit {
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();

    //@ViewChild('mainCanvas', { static: false })
    //private mainCanvas: ElementRef<HTMLCanvasElement>;

    constructor(private renderer: Renderer2) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');
        let diffDetector: DifferencesDetector;

        this.originalImage.src = '../../../assets/ImageBlanche.bmp';
        await this.waitForOriginalImageToLoad();
        this.modifiedImage.src = '../../../assets/ImageDiff.bmp';
        await this.waitForModifiedImageToLoad();

        // Eventuellement une fonction, si ca fonctionne
        const canvasOriginal = this.adaptCanvasSizeToImage(mainCanvas, this.originalImage);
        const canvasOriginalData = this.getImageData(this.originalImage, canvasOriginal);
        const canvasModified = this.adaptCanvasSizeToImage(mainCanvas, this.modifiedImage);
        const canvasModifiedData = this.getImageData(this.modifiedImage, canvasModified);

        const datas: ImageDataToCompare = {
            originalImageData: canvasOriginalData,
            modifiedImageData: canvasModifiedData,
            imageHeight: this.originalImage.height,
            imageWidth: this.originalImage.width,
        };

        diffDetector = new DifferencesDetector(datas, 20);

        const canvasResult = this.adaptCanvasSizeToImage(mainCanvas, this.originalImage);
        const canvasResultContext: CanvasRenderingContext2D = canvasResult.getContext('2d')!;
        const differentPixelsPositionArray = diffDetector.getDifferentPixelsArray();
        const imageGenerator = new DifferencesImageGenerator(mainCanvas);
        let resultImageData: ImageData;

        imageGenerator.generateImageFromPixelsDataArray(differentPixelsPositionArray);
        resultImageData = imageGenerator.getGeneratedImageData();

        console.log(diffDetector.getNbDifferences());

        canvasResultContext.putImageData(resultImageData, 0, 0);

        this.finalDifferencesImage.src = canvasResult.toDataURL();
    }

    getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): Uint8ClampedArray {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, image.width, image.height).data;
    }

    adaptCanvasSizeToImage(canvas: HTMLCanvasElement, image: HTMLImageElement): HTMLCanvasElement {
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas;
    }

    async waitForOriginalImageToLoad() {
        return new Promise((resolve, reject) => {
            this.originalImage.onload = () => resolve(this.originalImage);
            this.originalImage.onerror = reject;
        });
    }

    async waitForModifiedImageToLoad() {
        return new Promise((resolve, reject) => {
            this.modifiedImage.onload = () => resolve(this.modifiedImage);
            this.modifiedImage.onerror = reject;
        });
    }
}
