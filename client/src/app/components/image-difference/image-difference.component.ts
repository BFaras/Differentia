import { Component, Input, OnDestroy, OnInit, Renderer2, ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';
import { DRAW_BACKGROUND_MODE, MODIFIED_CANVAS_INDEX, ORIGINAL_CANVAS_INDEX } from '@app/const/client-consts';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { UploadFileService } from '@app/services/upload-file.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { DifferencesInformations } from '@common/differences-informations';

@Component({
    selector: 'app-image-difference',
    templateUrl: './image-difference.component.html',
    styleUrls: ['./image-difference.component.scss'],
})
export class ImageDifferenceComponent implements OnInit, OnDestroy {
    @Input() offset: number;
    readonly originalImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    readonly modifiedImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    readonly finalDifferencesImage: HTMLImageElement = new Image();
    private numberOfDifferences: number;
    private differencesList: number[][];

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

    loaded(): boolean {
        if (this.finalDifferencesImage.src !== '' && this.numberOfDifferences !== undefined) {
            this.gameToServerService.setNumberDifference(this.numberOfDifferences);
            this.gameToServerService.setUrlImageOfDifference(this.finalDifferencesImage.src);
            this.gameToServerService.setDifferencesList(this.differencesList);

            return true;
        } else {
            return false;
        }
    }

    private mergeImageCanvas(urlImage: string, index: number): string {
        this.mergeImageCanvasService.initializeImage(urlImage, index);
        this.mergeImageCanvasService.drawImageOnCanvas(index);
        return this.mergeImageCanvasService.obtainUrlForMerged(index);
    }

    private createImagesWithCanvas(): void {
        const unwrappedOriginalModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getOriginalImageUploaded().image as SafeValue);
        const unwrappedModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getModifiedImageUploaded().image as SafeValue);

        this.originalImage.src = this.mergeImageCanvas(
            unwrappedOriginalModifiedSafeUrl,
            this.gameToServerService.getOriginalImageUploaded().index as number,
        );
        this.modifiedImage.src = this.mergeImageCanvas(unwrappedModifiedSafeUrl, this.gameToServerService.getModifiedImageUploaded().index as number);
    }

    private createBackgroundForImages(indexCanvas: number): void {
        const canvas = this.mergeImageCanvasService.getCanvas()[indexCanvas];
        const context = canvas.getContext('2d');
        if (context !== null) {
            context.globalCompositeOperation = DRAW_BACKGROUND_MODE;
            context.fillStyle = '#FFF';
            context.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        }
    }

    private createImagesWithoutCanvas(): void {
        const canvasOriginal = this.mergeImageCanvasService.getCanvas()[ORIGINAL_CANVAS_INDEX];
        const canvasModified = this.mergeImageCanvasService.getCanvas()[MODIFIED_CANVAS_INDEX];

        this.createBackgroundForImages(ORIGINAL_CANVAS_INDEX);
        this.createBackgroundForImages(MODIFIED_CANVAS_INDEX);

        this.originalImage.src = canvasOriginal.toDataURL();

        this.modifiedImage.src = canvasModified.toDataURL();
    }

    private async loadImages(): Promise<void> {
        if (this.gameToServerService.getOriginalImageUploaded().image !== undefined) {
            this.createImagesWithCanvas();
        } else {
            this.createImagesWithoutCanvas();
        }

        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);
        this.uploadFileService.setOriginalMergedCanvasImage(this.originalImage);

        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);
        this.uploadFileService.setModifiedMergedCanvasImage(this.modifiedImage);
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

        /*
        for (const num of doubleArray) {
            for (const number of doubleArray[]) {
                linearizedArray.push(number);
            }
        }
        */
        return linearizedArray;
    }

    private setUpSocket() {
        this.socketService.connect();
        this.configureGameCreationPageSocketFeatures();
    }
}
