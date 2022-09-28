import { Component, ElementRef, ViewChild } from '@angular/core';
import { Position } from '@common/position';
import { DrawService } from '@app/services/draw.service';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs } from '@common/const';
import { MouseDetectionService } from '@app/services/mouse-detection.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    @ViewChild('gridCanvas', { static: false }) private canvas!: ElementRef<HTMLCanvasElement>;
    mousePosition: Position = { x: 0, y: 0 };

    private canvasSize = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    constructor(private readonly drawService: DrawService,
        private readonly mouseDetection: MouseDetectionService) {}

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    ngAfterViewInit(): void {
        this.drawService.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.canvas.nativeElement.focus();
    }

    detectDifference(event: MouseEvent){
        this.mouseDetection.mouseHitDetect(event);
    }
}
