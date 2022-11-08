import { Component, Input, OnDestroy, OnInit, Renderer2, ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { DifferencesInformations } from '@common/differences-informations';

@Component({
    selector: 'app-image-difference',
    templateUrl: './image-difference.component.html',
    styleUrls: ['./image-difference.component.scss'],
})
export class ImageDifferenceComponent implements OnInit, OnDestroy {
    @Input() offset: number;
    private numberOfDifferences: number;
    private differencesList: number[][];
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();

    constructor(
        private renderer: Renderer2,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private gameToServerService: GameToServerService,
        public socketService: SocketClientService,
        private mergeImageCanvasService: MergeImageCanvasHandlerService,
        private uploadFileService: UploadFileService,
    ) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');
        this.setUpSocket();
        await this.loadImages();
        const imagesData = this.imageToImageDifferenceService.getImagesData(mainCanvas, this.originalImage, this.modifiedImage, Number(this.offset));
        this.mergeImageCanvasService.resetCanvas();
        this.socketService.send('detect images difference', imagesData);
    }

    ngOnDestroy(): void {
        this.socketService.disconnect();
    }

    loaded() {
        if (this.finalDifferencesImage.src !== '' && this.numberOfDifferences !== undefined) {
            this.gameToServerService.setNumberDifference(this.numberOfDifferences);
            this.gameToServerService.setUrlImageOfDifference(this.finalDifferencesImage.src);
            this.gameToServerService.setDifferencesList(this.differencesList);

            return true;
        } else {
            return false;
        }
    }

    private async loadImages() {
        const unwrapedOriginalModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getOriginalImageUploaded().image as SafeValue);
        const unwrapedModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getModifiedImageUploaded().image as SafeValue);

        this.originalImage.src = this.mergeImageCanvas(unwrapedOriginalModifiedSafeUrl, this.gameToServerService.getOriginalImageUploaded().index!);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);
        this.uploadFileService.setOriginalMergedCanvasImage(this.originalImage);

        this.modifiedImage.src = this.mergeImageCanvas(unwrapedModifiedSafeUrl, this.gameToServerService.getModifiedImageUploaded().index!);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);
        this.uploadFileService.setModifiedMergedCanvasImage(this.modifiedImage);
    }

    mergeImageCanvas(urlImage: string, index: number): string {
        this.mergeImageCanvasService.initializeImage(urlImage, index);
        this.mergeImageCanvasService.drawImageOnCanvas(index);
        return this.mergeImageCanvasService.obtainUrlForMerged(index);
    }

    private configureGameCreationPageSocketFeatures() {
        this.socketService.on('game creation differences informations', (differencesInformations: DifferencesInformations) => {
            const differentPixelsPositionArray = this.linearizeDoubleArray(differencesInformations.differencesList);
            this.differencesList = differencesInformations.differencesList;
            this.numberOfDifferences = differencesInformations.nbOfDifferences;
            this.imageToImageDifferenceService.putDifferencesDataInImage(differentPixelsPositionArray, this.finalDifferencesImage);
        });
    }

    private linearizeDoubleArray(doubleArray: number[][]): number[] {
        const linearizedArray: number[] = [];

        for (let i = 0; i < doubleArray.length; i++) {
            for (let j = 0; j < doubleArray[i].length; j++) {
                linearizedArray.push(doubleArray[i][j]);
            }
        }

        return linearizedArray;
    }

    private setUpSocket() {
        this.socketService.connect();
        this.configureGameCreationPageSocketFeatures();
    }
}
