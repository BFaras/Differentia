import { Component, Input, OnDestroy, OnInit, Renderer2, ɵunwrapSafeValue as unwrapSafeValue } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';
import { GameToServerService } from '@app/services/game-to-server.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
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
    ) {}

    async ngOnInit(): Promise<void> {
        const mainCanvas = this.renderer.createElement('canvas');

        this.setUpSocket();
        await this.loadImages();

        const imagesData = this.imageToImageDifferenceService.getImagesData(mainCanvas, this.originalImage, this.modifiedImage, this.offset);

        this.socketService.send('detect images difference', imagesData);
    }

    ngOnDestroy(): void {
        this.socketService.disconnect();
    }

    //To test
    loaded() {
        if (this.finalDifferencesImage.src !== '') {
            if (this.numberOfDifferences !== undefined) {
                this.gameToServerService.setNumberDifference(this.numberOfDifferences);
                this.gameToServerService.setUrlImageOfDifference(this.finalDifferencesImage.src);
                this.gameToServerService.setDifferencesList(this.differencesList);
            }

            return true;
        } else {
            return false;
        }
    }

    //To test
    private async loadImages() {
        const unwrapedOriginalModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getOriginalImageUploaded().image as SafeValue);
        const unwrapedModifiedSafeUrl = unwrapSafeValue(this.gameToServerService.getModifiedImageUploaded().image as SafeValue);

        this.originalImage.src = unwrapedOriginalModifiedSafeUrl;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);

        this.modifiedImage.src = unwrapedModifiedSafeUrl;
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);
    }

    //To test
    private configureGameCreationPageSocketFeatures() {
        this.socketService.on('game creation differences informations', (differencesInformations: DifferencesInformations) => {
            const differentPixelsPositionArray = this.linearizeDoubleArray(differencesInformations.differencesList);
            this.differencesList = differencesInformations.differencesList;
            this.numberOfDifferences = differencesInformations.nbOfDifferences;
            this.imageToImageDifferenceService.putDifferencesDataInImage(differentPixelsPositionArray, this.finalDifferencesImage);
        });
    }

    //To test
    private linearizeDoubleArray(doubleArray: number[][]): number[] {
        const linearizedArray: number[] = [];

        for (let i = 0; i < doubleArray.length; i++) {
            for (let j = 0; j < doubleArray[i].length; j++) {
                linearizedArray.push(doubleArray[i][j]);
            }
        }

        return linearizedArray;
    }

    //To test
    private setUpSocket() {
        this.socketService.connect();
        this.configureGameCreationPageSocketFeatures();
    }
}
