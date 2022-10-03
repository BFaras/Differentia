import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawService } from '@app/services/draw.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs, MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Position } from '@common/position';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements OnInit {
    @ViewChild('originalCanvas', { static: false }) private originalCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('modifiedCanvas', { static: false }) private modifiedCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() differentImages: HTMLImageElement[];
    mousePosition: Position = { x: 0, y: 0 };

    private canvasSize = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    constructor(
        public socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: MouseDetectionService,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private renderer: Renderer2,
    ) {}

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);

        this.displayImage();
        this.sendImagesDataToServer();
    }

    displayImage() {
        this.drawService.context1 = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context1.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.originalCanvas.nativeElement.focus();

        this.drawService.context2 = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context2.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.modifiedCanvas.nativeElement.focus();
    }

    sendImagesDataToServer() {
        if (
            this.differentImages[ORIGINAL_IMAGE_POSITION] !== new Image(640, 480) &&
            this.differentImages[MODIFIED_IMAGE_POSITION] !== new Image(640, 480)
        ) {
            const mainCanvas = this.renderer.createElement('canvas');
            this.socketService.send(
                'image data to begin game',
                this.imageToImageDifferenceService.getImagesData(
                    mainCanvas,
                    this.differentImages[ORIGINAL_IMAGE_POSITION],
                    this.differentImages[MODIFIED_IMAGE_POSITION],
                    0,
                ),
            );
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    endGame() {
        // Fonction appeler quand le joueur gagne
        this.displayWinMessage();
        this.stopTimer(); // verifier si cest au bon endroit
        this.stopClicking();
    }

    displayWinMessage() {
        // TO DO : Fonctoin qui affiche un message de felicitations au joueur
        //         Devrait etre un pop-up, avec un bouton vers le menu principal
    }

    stopTimer() {
        // TO DO (voir avec sebastien) : Fonction qui arrete le timer et qui garde le temps en memoire
    }

    stopClicking() {
        // TO DO : Fonction qui fait en sorte d'ignorer les clics sur les images
        //         Possible de juste fermer le socket pour les
    }

    detectDifference(event: MouseEvent) {
        this.mouseDetection.mouseHitDetect(event);
    }

    configurePlayAreaSocket() {
        this.socketService.on('Valid click', (clickResponse: boolean) => {
            this.mouseDetection.playSound(clickResponse);
            this.mouseDetection.clickMessage(clickResponse);
        });
    }
}
