import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Coordinate } from '@app/interfaces/coordinate';
import { ClueHandlerService } from '@app/services/clue-handler.service';
import { DifferenceDetectionService } from '@app/services/difference-detection.service';
import { DrawService } from '@app/services/draw.service';
import { ImageGeneratorService } from '@app/services/image-generator.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ClueInformations } from '@common/clue-informations';
import {
    CHEAT_KEY,
    CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE,
    CLASSIC_MULTIPLAYER_LOST_MESSAGE,
    CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE,
    CLASSIC_SOLO_END_GAME_MESSAGE,
    CLUE_KEY,
    DEFAULT_HEIGHT_CANVAS,
    DEFAULT_WIDTH_CANVAs,
    EMPTY_ARRAY_LENGTH,
    MODIFIED_IMAGE_POSITION,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { PopDialogEndgameComponent } from '../pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements OnInit {
    @ViewChild('originalCanvas', { static: false }) originalCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('modifiedCanvas', { static: false }) modifiedCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('clickCanvas1', { static: false }) clickOriginalCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('clickCanvas2', { static: false }) clickModifiedCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('blinkCanvas2', { static: false }) blinkModifiedCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('blinkCanvas1', { static: false }) blinkOriginalCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() differentImages: HTMLImageElement[];
    @Input() localPlayerUsername: string;
    @Input() isMultiplayer: boolean;
    mousePosition: Position = { x: 0, y: 0 };
    private isCheatActivated = false;
    private blinkCanvasOrginial: ImageData;
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    private canStopBlinkingWaitingLine: boolean[];
    constructor(
        private socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: DifferenceDetectionService,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private dialog: MatDialog,
        private imageGenerator: ImageGeneratorService,
        private readonly clueHandlerService: ClueHandlerService,
    ) {
        this.canStopBlinkingWaitingLine = [];
    }

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);

        this.displayImages();

        // Raph : mettre le blink canvas blanc

        this.blinkCanvasOrginial = this.blinkModifiedCanvas.nativeElement
            .getContext('2d')!
            .getImageData(0, 0, this.blinkModifiedCanvas.nativeElement.width, this.blinkModifiedCanvas.nativeElement.height);
    }

    private displayImages() {
        this.drawService.context1 = this.clickOriginalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context1.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.clickOriginalCanvas.nativeElement.focus();

        this.drawService.context2 = this.clickModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context2.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.clickModifiedCanvas.nativeElement.focus();

        this.drawService.context3 = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context3.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.originalCanvas.nativeElement.focus();

        this.drawService.context4 = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context4.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.modifiedCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    detectDifference(event: MouseEvent) {
        this.mouseDetection.mouseHitDetect(event);
    }

    private openEndGameDialog(messageToDisplay: string) {
        this.dialog.open(PopDialogEndgameComponent, {
            height: '400px',
            width: '600px',
            data: messageToDisplay,
            disableClose: true,
        });
    }

    // To test Charles
    @HostListener(CHEAT_KEY, ['$event'])
    handleKeyboardCheat() {
        if (this.isCheatActivated) {
            const originalContext = this.blinkOriginalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            originalContext.canvas.id = 'paused';
            const modifiedContext = this.blinkModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            modifiedContext.canvas.id = 'paused';
            this.isCheatActivated = !this.isCheatActivated;
        } else {
            this.socketService.send('Cheat key pressed');
            this.isCheatActivated = !this.isCheatActivated;
        }
    }

    //To test Raph
    @HostListener(CLUE_KEY, ['$event'])
    handleKeyboardClue() {
        this.socketService.send('get clue for player');
    }

    private configurePlayAreaSocket(): void {
        this.socketService.on('Valid click', (differencesInfo: GameplayDifferenceInformations) => {
            const isLocalPlayer = differencesInfo.socketId == this.socketService.socket.id;

            let isDifference: boolean = differencesInfo.isValidDifference;
            this.mouseDetection.playSound(isDifference, isLocalPlayer);
            this.mouseDetection.clickMessage(isDifference, isLocalPlayer);
            this.mouseDetection.verifyGameFinished(isDifference, this.isMultiplayer, isLocalPlayer);

            if (isDifference) {
                if (!this.isCheatActivated) this.makePixelsBlinkOnCanvas(differencesInfo.differencePixelsNumbers, this.modifiedCanvas.nativeElement);

                this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
                    differencesInfo.differencePixelsNumbers,
                    this.originalCanvas.nativeElement,
                    this.modifiedCanvas.nativeElement,
                );

                this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
                    differencesInfo.differencePixelsNumbers,
                    this.originalCanvas.nativeElement,
                    this.blinkOriginalCanvas.nativeElement,
                );
            }
        });

        // To test Charles
        this.socketService.on('Cheat pixel list', (pixelList: number[]) => {
            this.makePixelsBlinkOnCanvasCheat(pixelList, this.originalCanvas.nativeElement, this.blinkModifiedCanvas.nativeElement);
            this.makePixelsBlinkOnCanvasCheat(pixelList, this.modifiedCanvas.nativeElement, this.blinkOriginalCanvas.nativeElement);
        });

        //To test Raph
        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {
            const quandrantPixelsNb: number[] = this.clueHandlerService.findClueQuadrantPixels(
                clueInformations.clueAmountLeft,
                clueInformations.clueDifferenceQuadrant,
            );
            this.makePixelsBlinkOnCanvas(quandrantPixelsNb, this.modifiedCanvas.nativeElement, true);
        });

        //To test Raph
        this.socketService.on('Clue with difference pixels', (differenceNotFoundPixels: number[]) => {
            this.makePixelsBlinkOnCanvas(differenceNotFoundPixels, this.originalCanvas.nativeElement);
        });

        this.socketService.on('End game', (endGameInfos: EndGameInformations) => {
            let endGameMessage = CLASSIC_SOLO_END_GAME_MESSAGE;
            if (endGameInfos.isMultiplayer && endGameInfos.isGameWon && !endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE;
            } else if (endGameInfos.isMultiplayer && endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE;
            } else if (!endGameInfos.isGameWon) {
                endGameMessage = CLASSIC_MULTIPLAYER_LOST_MESSAGE;
            }
            this.openEndGameDialog(endGameMessage);
        });
    }

    private makePixelsBlinkOnCanvas(pixelsToBlink: number[], canvasToCopyFrom: HTMLCanvasElement, invertColors?: boolean) {
        this.blinkModifiedCanvas.nativeElement.getContext('2d')?.putImageData(this.blinkCanvasOrginial, 0, 0);
        const context = this.blinkModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        context.canvas.id = 'blink';
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
            pixelsToBlink,
            canvasToCopyFrom,
            this.blinkModifiedCanvas.nativeElement,
            invertColors,
        );

        this.canStopBlinkingWaitingLine.push(true);
        setTimeout(() => {
            //To test Raph
            this.canStopBlinkingWaitingLine.pop();
            if (this.canStopBlinkingWaitingLine.length == EMPTY_ARRAY_LENGTH) {
                context.canvas.id = 'paused';
            }
        }, 3000);
    }

    private makePixelsBlinkOnCanvasCheat(pixelsToBlink: number[], canvasToCopyFrom: HTMLCanvasElement, canvasToCopyOn: HTMLCanvasElement) {
        canvasToCopyOn.getContext('2d')?.putImageData(this.blinkCanvasOrginial, 0, 0);
        const context = canvasToCopyOn.getContext('2d') as CanvasRenderingContext2D;
        context.canvas.id = 'blinkCheat';
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(pixelsToBlink, canvasToCopyFrom, canvasToCopyOn);
    }
}
