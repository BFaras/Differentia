import { Injectable } from '@angular/core';
import { Position } from '@common/position';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    context1: CanvasRenderingContext2D;
    context2: CanvasRenderingContext2D;
    context3: CanvasRenderingContext2D;
    context4: CanvasRenderingContext2D;

    drawWord(word: string, mousePosition: Position, context: CanvasRenderingContext2D) {
        const startPosition: Position = { x: mousePosition.x, y: mousePosition.y };
        const step = 20;
        console.log(startPosition);
        for (let i = 0; i < word.length; i++) {
            context.fillText(word[i], startPosition.x + step * i, startPosition.y);
            context.canvas.id = 'noClick';
        }
        setTimeout(() => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.canvas.id = 'click';
        }, 1000);
    }
}
