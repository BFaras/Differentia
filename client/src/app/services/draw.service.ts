import { Injectable } from '@angular/core';
import { Position } from '@common/position';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    contextClickOriginalCanvas: CanvasRenderingContext2D;
    contextClickModifiedCanvas: CanvasRenderingContext2D;

    drawWord(word: string, mousePosition: Position, context: CanvasRenderingContext2D) {
        const startPosition: Position = { x: mousePosition.x, y: mousePosition.y };
        const STEP = 20;
        for (let i = 0; i < word.length; i++) {
            context.fillText(word[i], startPosition.x + STEP * i, startPosition.y);
            context.canvas.id = 'noClick';
        }
        setTimeout(() => {
            this.setCanvasTransparent(context.canvas);
            context.canvas.id = 'click';
        }, 1000);
    }

    drawImageOnMiddleOfCanvas(
        imageToDraw: HTMLImageElement,
        contextToDrawOn: CanvasRenderingContext2D,
        xPositionOffset: number,
        yPositionOffset: number,
    ) {
        const xMiddlePosition: number = this.calculateLeftTopCornerMiddlePosition(contextToDrawOn.canvas.width, imageToDraw.width);
        const yMiddlePosition: number = this.calculateLeftTopCornerMiddlePosition(contextToDrawOn.canvas.height, imageToDraw.height);
        contextToDrawOn.drawImage(
            imageToDraw,
            xMiddlePosition + xPositionOffset,
            yMiddlePosition + yPositionOffset,
            imageToDraw.width,
            imageToDraw.height,
        );
    }

    setCanvasTransparent(canvas: HTMLCanvasElement) {
        const canvasContext = canvas.getContext('2d')!;
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }

    private calculateLeftTopCornerMiddlePosition(canvasSize: number, imageSize: number): number {
        return Math.floor(canvasSize / 2) - Math.floor(imageSize / 2);
    }
}
