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

    constructor(public socketService: SocketClientService, private imageGeneratorService: ImageGeneratorService) {
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

    getImagesData(mainCanvas: HTMLCanvasElement, originalImage: HTMLImageElement, modifiedImage: HTMLImageElement, offSet: number) {
        this.setupDataInService(mainCanvas, originalImage, modifiedImage, new Image());
        return this.generateImagesDataToCompare(offSet);
    }

    putDifferencesDataInImage(differentPixelsPositionArray: number[]) {
        const canvasResult = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasResultContext: CanvasRenderingContext2D = canvasResult.getContext('2d')!;
        const resultImageData: ImageData = this.imageGeneratorService.generateBlackImageFromPixelsDataArray(differentPixelsPositionArray, this.mainCanvas);

        canvasResultContext.putImageData(resultImageData, 0, 0);
        this.differencesImageToPutDataIn.src = canvasResult.toDataURL();
    }

    private setupDataInService(
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

    private adaptCanvasSizeToImage(canvas: HTMLCanvasElement, image: HTMLImageElement): HTMLCanvasElement {
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas;
    }

    private generateImagesDataToCompare(offSet: number): ImageDataToCompare {
        const canvasOriginal : HTMLCanvasElement = this.adaptCanvasSizeToImage(this.mainCanvas, this.originalImage);
        const canvasOriginalData : Uint8ClampedArray = this.imageGeneratorService.getImageData(this.originalImage, canvasOriginal).data;
        const canvasModified : HTMLCanvasElement = this.adaptCanvasSizeToImage(this.mainCanvas, this.modifiedImage);
        const canvasModifiedData : Uint8ClampedArray = this.imageGeneratorService.getImageData(this.modifiedImage, canvasModified).data;

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
            imageToLoad.onerror = (error) => reject(console.log(error));
        });
    }
}
