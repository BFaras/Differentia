import { Injectable } from '@angular/core';
import { MouseButton } from '@common/mouseButton';
import { Position } from '@common/position';
import { DrawService } from './draw.service';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class MouseDetectionService {
    constructor(public socketService: SocketClientService, private drawService: DrawService) {}
    mousePosition: Position = { x: 0, y: 0 };
    nbrDifferencesTotal: number;
    nbrDifferencesFound: number = 0;
    message: string = '';
    audio: HTMLAudioElement;

    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            this.socketService.send('Verify position', this.mousePosition);
        }
    }

    playSound(differenceIsValid: boolean) {
        this.audio = new Audio();
        this.audio.autoplay;
        if (differenceIsValid) this.audio.src = '../../assets/sounds/validSound.mp3';
        else this.audio.src = '../../assets/sounds/invalidSound.mp3';
        this.audio.load();
        this.audio.play();
        this.audio.muted;
    }

    clickMessage(differenceIsValid: boolean) {
        if (differenceIsValid) {
            this.message = 'GOOD JOB';
            this.drawService.context1.fillStyle = 'green';
            this.drawService.context2.fillStyle = 'green';
        } else {
            this.message = 'ERROR';
            this.drawService.context1.fillStyle = 'red';
            this.drawService.context2.fillStyle = 'red';
        }
        this.drawMessage(this.message);
    }

    incrementNbrDifference(differenceIsValid: boolean) {
        if (differenceIsValid) {
            this.nbrDifferencesFound += 1;
            this.socketService.send('Check if game is finished');
        }
    }

    drawMessage(message: string) {
        this.drawService.drawWord(message, this.mousePosition, this.drawService.context1);
        this.drawService.drawWord(message, this.mousePosition, this.drawService.context2);
    }
}
