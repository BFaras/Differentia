import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DrawService } from '@app/services/draw.service';
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
    ) {}

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

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
