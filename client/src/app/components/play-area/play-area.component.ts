import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageGeneratorService } from '@app/services/difference-detector-feature/image-generator.service';
import { DrawService } from '@app/services/draw.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs, MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Position } from '@common/position';
import { PopDialogEndgameComponent } from '../pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements OnInit {
    @ViewChild('originalCanvas', { static: false }) private originalCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('modifiedCanvas', { static: false }) private modifiedCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('clickCanvas1', { static: false }) private clickCanvas1!: ElementRef<HTMLCanvasElement>;
    @ViewChild('clickCanvas2', { static: false }) private clickCanvas2!: ElementRef<HTMLCanvasElement>;
    //@ViewChild('clignotementCanvas', { static: false }) private clignotementCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() differentImages: HTMLImageElement[];
    @Input() nbDifferencesTotal: number = 0;
    mousePosition: Position = { x: 0, y: 0 };
    pixelList: number[] = [];

    private canvasSize = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    constructor(
        public socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: MouseDetectionService,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private dialog: MatDialog,
        private imageGenerator: ImageGeneratorService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

        this.mouseDetection.nbrDifferencesTotal = this.nbDifferencesTotal;

        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);

        this.displayImages();
    }

    ngOnDestroy() {
        this.mouseDetection.nbrDifferencesFound = 0;
    }

    displayImages() {
        this.drawService.context1 = this.clickCanvas1.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context1.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.originalCanvas.nativeElement.focus();

        this.drawService.context2 = this.clickCanvas2.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context2.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.modifiedCanvas.nativeElement.focus();

        this.drawService.context3 = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context3.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.originalCanvas.nativeElement.focus();

        this.drawService.context4 = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context4.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.modifiedCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    detectDifference(event: MouseEvent) {
        this.mouseDetection.mouseHitDetect(event);
    }

    openDialog() {
        this.dialog.open(PopDialogEndgameComponent, {
            height: '400px',
            width: '600px',
        });
    }

    configurePlayAreaSocket(): void {
        this.socketService.on('Valid click', (response: number[]) => {
            this.pixelList = response;

            console.log(this.pixelList);

            let isDifference: boolean = true;
            if (this.pixelList.length == 0) {
                isDifference = false;
            }
            this.mouseDetection.playSound(isDifference);
            this.mouseDetection.clickMessage(isDifference);
            this.mouseDetection.incrementNbrDifference(isDifference);

            if (isDifference) {
                console.log('Appel de copycertain...');
                this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
                    this.pixelList,
                    this.originalCanvas.nativeElement,
                    this.modifiedCanvas.nativeElement,
                );
                /*
                this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
                    this.pixelList,
                    this.originalCanvas.nativeElement,
                    this.clignotementCanvas.nativeElement,
                );
                */
            }
        });

        this.socketService.on('End game', () => {
            // Ajouter une fonction pour annuler tous les clics sur les canvas avec pointer-events : none?
            this.openDialog();
        });
    }
}
