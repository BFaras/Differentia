import { Injectable } from '@angular/core';
import {
    BLINK_CHEAT_ID,
    BLINK_ID,
    CLUE_MIDDLE_COMPASS_OFFSET_X,
    COMPASS_CLUE_ID,
    NO_OFFSET,
    PAUSED_ID,
    THREE_SECONDS,
} from '@app/const/client-consts';
import { CompassInformations } from '@app/interfaces/compass-informations';
import { ClueInformations } from '@common/clue-informations';
import { Position } from '@common/position';
import { ClueHandlerService } from './clue-handler.service';
import { ImageGeneratorService } from './image-generator.service';

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    contextClickOriginalCanvas: CanvasRenderingContext2D;
    contextClickModifiedCanvas: CanvasRenderingContext2D;
    private numberOfBlinkCalls = 0;

    constructor(private readonly clueHandlerService: ClueHandlerService, private readonly imageGenerator: ImageGeneratorService) {}

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

    //To test (With the test from the Clue with quadrant of difference event in PlayAreaComponent)
    showQuadrantClue(clueInformations: ClueInformations, canvasToBlink: HTMLCanvasElement, canvasToCopyFrom: HTMLCanvasElement) {
        const quandrantPixelsNb: number[] = this.clueHandlerService.findClueQuadrantPixels(
            clueInformations.clueAmountLeft,
            clueInformations.clueDifferenceQuadrant,
        );
        this.makePixelsBlinkOnCanvas(quandrantPixelsNb, canvasToBlink, canvasToCopyFrom, true);
    }

    setCanvasTransparent(canvas: HTMLCanvasElement) {
        const canvasContext = canvas.getContext('2d')!;
        canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
    }

    //To test
    makePixelsBlinkOnCanvas(pixelsToBlink: number[], canvasToBlink: HTMLCanvasElement, canvasToCopyFrom: HTMLCanvasElement, invertColors?: boolean) {
        const context = canvasToBlink.getContext('2d') as CanvasRenderingContext2D;
        this.setCanvasTransparent(canvasToBlink);
        context.canvas.id = BLINK_ID;
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(pixelsToBlink, canvasToCopyFrom, canvasToBlink, invertColors);

        this.incrementNumberOfBlinkCalls();
        setTimeout(() => {
            this.decrementNumberOfBlinkCalls();
            if (this.numberOfBlinkCalls <= 0 && canvasToBlink.id === BLINK_ID) {
                context.canvas.id = PAUSED_ID;
            }
        }, THREE_SECONDS);
    }

    //To test
    makePixelsBlinkOnCanvasCheat(pixelsToBlink: number[], canvasToCopyFrom: HTMLCanvasElement, canvasToCopyOn: HTMLCanvasElement) {
        this.setCanvasTransparent(canvasToCopyOn);
        const context = canvasToCopyOn.getContext('2d') as CanvasRenderingContext2D;
        context.canvas.id = BLINK_CHEAT_ID;
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(pixelsToBlink, canvasToCopyFrom, canvasToCopyOn);
    }

    incrementNumberOfBlinkCalls() {
        this.numberOfBlinkCalls++;
    }

    decrementNumberOfBlinkCalls() {
        this.numberOfBlinkCalls--;
    }

    private drawImageOnMiddleOfCanvas(
        imageToDraw: HTMLImageElement,
        contextToDrawOn: CanvasRenderingContext2D,
        xPositionOffset: number,
        yPositionOffset: number,
    ) {
        const xMiddlePosition: number = this.getMiddlePositionInCanvas(contextToDrawOn.canvas.width, imageToDraw.width);
        const yMiddlePosition: number = this.getMiddlePositionInCanvas(contextToDrawOn.canvas.height, imageToDraw.height);
        contextToDrawOn.drawImage(
            imageToDraw,
            xMiddlePosition + xPositionOffset,
            yMiddlePosition + yPositionOffset,
            imageToDraw.width,
            imageToDraw.height,
        );
    }

    private getMiddlePositionInCanvas(canvasSize: number, imageSize: number): number {
        return Math.floor(canvasSize / 2) - Math.floor(imageSize / 2);
    }
}
