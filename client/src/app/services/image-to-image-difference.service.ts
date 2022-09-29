import { Injectable } from '@angular/core';
import { SocketClientService } from '@app/services/socket-client.service';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { ImageGeneratorService } from './difference-detector-feature/image-generator.service';

@Injectable({
    providedIn: 'root',
})
export class ImageToImageDifferenceService {
    private originalImage: HTMLImageElement = new Image();
    private modifiedImage: HTMLImageElement = new Image();
    private differencesImageToPutDataIn: HTMLImageElement;
    private mainCanvas: HTMLCanvasElement;

    constructor(public socketService: SocketClientService) {
        this.setUpSocket();
    }

    configureGamePageSocketFeatures() {
        this.socketService.on('game creation difference array', (differentPixelsPositionArray: number[]) => {
            this.putDifferencesDataInImage(differentPixelsPositionArray);
        });
    }

    sendDifferentImagesInformationToServerForGameCreation(
        mainCanvas: HTMLCanvasElement,
        originalImage: HTMLImageElement,
        modifiedImage: HTMLImageElement,
        differencesImageToPutDataIn: HTMLImageElement,
        offSet: number,
    ) {
        let imagesData: ImageDataToCompare;

        this.setupDataInService(mainCanvas, originalImage, modifiedImage, differencesImageToPutDataIn);

        imagesData = this.generateImagesDataToCompare(offSet);
        this.getInformationToGenerateDifferencesImage(imagesData);
    }

    sendDifferentImagesInformationToServerForGameSolo(
        mainCanvas: HTMLCanvasElement,
        originalImage: HTMLImageElement,
        modifiedImage: HTMLImageElement,
        differencesImageToPutDataIn: HTMLImageElement,
        offSet: number,
    ) {
        //let imagesData: ImageDataToCompare;

        this.setupDataInService(mainCanvas, originalImage, modifiedImage, differencesImageToPutDataIn);

        //imagesData = this.generateImagesDataToCompare(offSet);
    }

    putDifferencesDataInImage(differentPixelsPositionArray: number[]) {
        const canvasResult = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasResultContext: CanvasRenderingContext2D = canvasResult.getContext('2d')!;
        const imageGenerator = new ImageGeneratorService(this.mainCanvas);
        let resultImageData: ImageData;

        imageGenerator.generateImageFromPixelsDataArray(differentPixelsPositionArray);
        resultImageData = imageGenerator.getGeneratedImageData();

        canvasResultContext.putImageData(resultImageData, 0, 0);
        this.differencesImageToPutDataIn.src = canvasResult.toDataURL();
    }

    setupDataInService(
        mainCanvas: HTMLCanvasElement,
        originalImage: HTMLImageElement,
        modifiedImage: HTMLImageElement,
        differencesImageToPutDataIn: HTMLImageElement,
    ) {
        this.originalImage = originalImage;
        this.modifiedImage = modifiedImage;
        this.differencesImageToPutDataIn = differencesImageToPutDataIn;
        this.mainCanvas = mainCanvas;
    }

    private getImageData(image: HTMLImageElement, canvas: HTMLCanvasElement): Uint8ClampedArray {
        const imageContext = canvas.getContext('2d');
        imageContext!.drawImage(image, 0, 0);
        return imageContext!.getImageData(0, 0, image.width, image.height).data;
    }

    private adaptCanvasSizeToImage(canvas: HTMLCanvasElement, image: HTMLImageElement): HTMLCanvasElement {
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas;
    }

    private generateImagesDataToCompare(offSet: number): ImageDataToCompare {
        const canvasOriginal = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasOriginalData = this.getImageData(this.originalImage, canvasOriginal);
        const canvasModified = this.adaptCanvasSizeToImage(this.mainCanvas, this.modifiedImage);
        const canvasModifiedData = this.getImageData(this.modifiedImage, canvasModified);

        const imagesdata: ImageDataToCompare = {
            originalImageData: canvasOriginalData,
            modifiedImageData: canvasModifiedData,
            imageHeight: this.originalImage.height,
            imageWidth: this.originalImage.width,
            offSet: offSet,
        };

        return imagesdata;
    }

    private getInformationToGenerateDifferencesImage(imagesData: ImageDataToCompare) {
        this.setUpSocket();
        this.socketService.send('detect images difference', imagesData);
    }

    private setUpSocket() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
            this.configureGamePageSocketFeatures();
        }
    }

    async waitForImageToLoad(imageToLoad: HTMLImageElement) {
        return new Promise((resolve, reject) => {
            imageToLoad.onload = () => resolve(imageToLoad);
            imageToLoad.onerror = reject;
        });
    }
}
