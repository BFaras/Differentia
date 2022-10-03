import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
    ) {}

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);

        this.displayImage();
    }

    displayImage() {
        this.drawService.context = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.originalCanvas.nativeElement.focus();

        this.drawService.context = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.modifiedCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    /* ngOnInit() {
        this.socketService.connect();
        this.configurePlayAreaSocket();
    }*/

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
