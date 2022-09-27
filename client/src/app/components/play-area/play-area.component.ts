import { Component, ElementRef, ViewChild } from '@angular/core';
import { Position } from '@common/position';
import { DrawService } from '@app/services/draw.service';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs } from '@common/const';
import { CommunicationService } from '@app/services/communication.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent {
    @ViewChild('gridCanvas', { static: false }) private canvas!: ElementRef<HTMLCanvasElement>;
    mousePosition: Position = { x: 0, y: 0 };

    private canvasSize = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    constructor(private readonly drawService: DrawService, private communicationService: CommunicationService) {}

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

    // TODO : déplacer ceci dans un service de gestion de la souris!
    detectDifference(event: MouseEvent) {
        this.communicationService
        .mouseClick(event)
        .subscribe((position)=> {
            console.log('Enter in subscription !')
            this.mousePosition.x = position.x;
            this.mousePosition.y = position.y;
        });
        this.playSound(true);
        
    }
    
    playSound(differenceIsValid:boolean){
        let audio = new Audio();
        if (differenceIsValid) audio.src ="../../assets/sounds/validSound.mp3";
        if (!differenceIsValid) audio.src ="../../assets/sounds/invalidSound.mp3";
        audio.load();
        audio.play();
    }
}
