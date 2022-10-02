import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DrawService } from '@app/services/draw.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs } from '@common/const';
import { Position } from '@common/position';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements OnInit {
    @ViewChild('gridCanvas', { static: false }) private canvas!: ElementRef<HTMLCanvasElement>;
    mousePosition: Position = { x: 0, y: 0 };
    readonly originalImage: HTMLImageElement = new Image();
    readonly modifiedImage: HTMLImageElement = new Image();
    readonly finalDifferencesImage: HTMLImageElement = new Image();

    private canvasSize = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    constructor(
        public socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: MouseDetectionService,
        private renderer: Renderer2,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

        const mainCanvas = this.renderer.createElement('canvas');

        this.originalImage.src = '../../../assets/images/image_7_diff.bmp';
        await this.imageToImageDifferenceService.waitForImageToLoad(this.originalImage);
        this.modifiedImage.src = '../../../assets/images/image_7_diff.bmp';
        await this.imageToImageDifferenceService.waitForImageToLoad(this.modifiedImage);

        this.imageToImageDifferenceService.sendDifferentImagesInformationToServerForGameSolo(
            mainCanvas,
            this.originalImage,
            this.modifiedImage,
            this.finalDifferencesImage,
            0,
        );

        this.drawService.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context.drawImage(this.originalImage, 0, 0);
        this.canvas.nativeElement.focus();
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
