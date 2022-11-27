import { Injectable } from '@angular/core';
import { CLUE_MIDDLE_COMPASS_OFFSET_X, COMPASS_CLUE_ID, NO_OFFSET } from '@app/client-consts';
import { CompassInformations } from '@app/interfaces/compass-informations';
import { Position } from '@common/position';
import { ClueHandlerService } from './clue-handler.service';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    contextClickOriginalCanvas: CanvasRenderingContext2D;
    contextClickModifiedCanvas: CanvasRenderingContext2D;

    constructor(private readonly clueHandlerService: ClueHandlerService) {}

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

    async showCompassClue(differenceCluePixels: number[], canvasToShowOn: HTMLCanvasElement) {
        const compassInfos: CompassInformations = await this.clueHandlerService.getCompassInformationsForClue(differenceCluePixels);
        const canvasToShowOnContext: CanvasRenderingContext2D = canvasToShowOn.getContext('2d') as CanvasRenderingContext2D;

        this.setCanvasTransparent(canvasToShowOn);
        canvasToShowOn.id = COMPASS_CLUE_ID;

        if (compassInfos.isDifferenceClueMiddle) {
            this.drawImageOnMiddleOfCanvas(compassInfos.compassClueImage, canvasToShowOnContext, CLUE_MIDDLE_COMPASS_OFFSET_X, NO_OFFSET);
        } else {
            this.drawImageOnMiddleOfCanvas(compassInfos.compassClueImage, canvasToShowOnContext, NO_OFFSET, NO_OFFSET);
        }
    }

    setCanvasTransparent(canvas: HTMLCanvasElement) {
        const canvasContext = canvas.getContext('2d')!;
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }

    private drawImageOnMiddleOfCanvas(
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

    private calculateLeftTopCornerMiddlePosition(canvasSize: number, imageSize: number): number {
        return Math.floor(canvasSize / 2) - Math.floor(imageSize / 2);
    }
}
