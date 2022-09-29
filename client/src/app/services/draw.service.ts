import { Injectable } from '@angular/core';
import { Position } from '@common/position';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    context: CanvasRenderingContext2D;

    drawWord(word: string, mousePosition: Position) {
        const startPosition: Position = { x: mousePosition.x , y: mousePosition.y };
        const step = 20;
        this.context.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.context.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }
}
