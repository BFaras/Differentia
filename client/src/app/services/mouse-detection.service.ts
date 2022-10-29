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
    message: string = '';
    audio: HTMLAudioElement;

    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            this.socketService.send('Verify position', this.mousePosition);
        }
    }

    //To test
    playSound(differenceIsValid: boolean, isLocalPlayer: boolean) {
        if (differenceIsValid) this.playAudio('../../assets/sounds/validSound.mp3');
        else if (isLocalPlayer) this.playAudio('../../assets/sounds/invalidSound.mp3');
    }

    //To test
    clickMessage(differenceIsValid: boolean, isLocalPlayer: boolean) {
        if (differenceIsValid) {
            this.message = 'BON TRAVAIL';
            this.drawService.context1.fillStyle = 'green';
            this.drawService.context2.fillStyle = 'green';
            this.drawMessage(this.message);
        } else if (isLocalPlayer) {
            this.message = 'ERREUR';
            this.drawService.context1.fillStyle = 'red';
            this.drawService.context2.fillStyle = 'red';
            this.drawMessage(this.message);
        }
    }

    verifyGameFinished(differenceIsValid: boolean) {
        if (differenceIsValid) {
            this.socketService.send('Check if game is finished');
        }
    }

    drawMessage(message: string) {
        this.drawService.drawWord(message, this.mousePosition, this.drawService.context1);
        this.drawService.drawWord(message, this.mousePosition, this.drawService.context2);
    }

    private playAudio(audioSource: string) {
        this.audio = new Audio();
        this.audio.autoplay;
        this.audio.src = audioSource;
        this.audio.load();
        this.audio.play();
        this.audio.muted;
    }
}
