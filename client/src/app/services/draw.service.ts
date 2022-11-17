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
    context5: CanvasRenderingContext2D;

    drawWord(word: string, mousePosition: Position, context: CanvasRenderingContext2D) {
        const startPosition: Position = { x: mousePosition.x, y: mousePosition.y };
        const STEP = 20;
        for (let i = 0; i < word.length; i++) {
            context.fillText(word[i], startPosition.x + STEP * i, startPosition.y);
            context.canvas.id = 'noClick';
        }
        setTimeout(() => {
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            context.canvas.id = 'click';
        }, 1000);
    }

    //To test Raph
    setCanvasTransparent(canvas: HTMLCanvasElement) {
        const canvasContext = canvas.getContext('2d')!;
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }
}
