import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    BLINK_ID,
    CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE,
    CLASSIC_MULTIPLAYER_LOST_MESSAGE,
    CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE,
    CLASSIC_SOLO_END_GAME_MESSAGE,
    DISABLE_CLOSE,
    LOSING_FLAG,
    PAUSED_ID,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
    WIN_FLAG,
} from '@app/client-consts';
import { PopDialogEndgameComponent } from '@app/components/pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';
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
    CLASSIC_MODE,
    CLUE_KEY,
    DEFAULT_HEIGHT_CANVAS,
    DEFAULT_WIDTH_CANVAs,
    MODIFIED_IMAGE_POSITION,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';

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
    @Input() mode: string;
    mousePosition: Position = { x: 0, y: 0 };
    private isCheatActivated = false;
    private isWriting = false;
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    private numberOfBlinkCalls = 0;
    constructor(
        private socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: DifferenceDetectionService,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private dialog: MatDialog,
        private imageGenerator: ImageGeneratorService,
        private readonly clueHandlerService: ClueHandlerService,
    ) {}

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();
        await this.loadImages();
    }

    async loadImages(): Promise<void> {
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);
        this.displayImages();
        this.setClickCanvasesTransparent();
    }

    detectDifference(event: MouseEvent) {
        this.mouseDetection.mouseHitDetect(event);
    }

    private setClickCanvasesTransparent() {
        this.drawService.setCanvasTransparent(this.clickOriginalCanvas.nativeElement);
        this.drawService.setCanvasTransparent(this.clickModifiedCanvas.nativeElement);
    }

    private displayImages() {
        this.drawService.contextClickOriginalCanvas = this.clickOriginalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.contextClickOriginalCanvas.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.clickOriginalCanvas.nativeElement.focus();

        this.drawService.contextClickModifiedCanvas = this.clickModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.contextClickModifiedCanvas.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.clickModifiedCanvas.nativeElement.focus();

        const originalCanavasContext = this.originalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        originalCanavasContext.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.originalCanvas.nativeElement.focus();

        const modifiedCanvasContext = this.modifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        modifiedCanvasContext.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.modifiedCanvas.nativeElement.focus();
    }

    private openEndGameDialog(messageToDisplay: string, winFlag: boolean) {
        this.dialog.open(PopDialogEndgameComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            data: {
                message: messageToDisplay,
                winFlag,
            },
            disableClose: DISABLE_CLOSE,
        });
    }

    @HostListener(CHEAT_KEY, ['$event'])
    handleKeyboardCheat() {
        if (this.isCheatActivated && !this.isWriting) {
            const originalContext = this.blinkOriginalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            originalContext.canvas.id = 'paused';
            const modifiedContext = this.blinkModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
            modifiedContext.canvas.id = 'paused';
            this.isCheatActivated = !this.isCheatActivated;
        } else if (!this.isWriting) {
            this.socketService.send('Cheat key pressed');
            this.isCheatActivated = !this.isCheatActivated;
        }
    }

    @HostListener(CLUE_KEY, ['$event'])
    handleKeyboardClue() {
        this.socketService.send('get clue for player');
    }

    private configurePlayAreaSocket(): void {
        this.socketService.on('Valid click', (differencesInfo: GameplayDifferenceInformations) => {
            const isLocalPlayer = differencesInfo.socketId == this.socketService.socket.id;

            const isDifference: boolean = differencesInfo.isValidDifference;
            this.mouseDetection.playSound(isDifference, isLocalPlayer);
            this.mouseDetection.clickMessage(isDifference, isLocalPlayer);
            this.mouseDetection.verifyGameFinished(isDifference, this.isMultiplayer, isLocalPlayer);

            if (isDifference && this.mode == CLASSIC_MODE) {
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

        this.socketService.on('Cheat pixel list', (pixelList: number[]) => {
            this.makePixelsBlinkOnCanvasCheat(pixelList, this.originalCanvas.nativeElement, this.blinkModifiedCanvas.nativeElement);
            this.makePixelsBlinkOnCanvasCheat(pixelList, this.modifiedCanvas.nativeElement, this.blinkOriginalCanvas.nativeElement);
        });

        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {
            const quandrantPixelsNb: number[] = this.clueHandlerService.findClueQuadrantPixels(
                clueInformations.clueAmountLeft,
                clueInformations.clueDifferenceQuadrant,
            );
            this.makePixelsBlinkOnCanvas(quandrantPixelsNb, this.modifiedCanvas.nativeElement, true);
        });

        this.socketService.on('Clue with difference pixels', (differenceCluePixels: number[]) => {
            this.clueHandlerService.getCompassInformationsForClue(differenceCluePixels);
            this.makePixelsBlinkOnCanvas(differenceCluePixels, this.originalCanvas.nativeElement);
        });

        this.socketService.on('End game', (endGameInfos: EndGameInformations) => {
            let endGameMessage = CLASSIC_SOLO_END_GAME_MESSAGE;
            let winFlag = WIN_FLAG;
            if (endGameInfos.isMultiplayer && endGameInfos.isGameWon && !endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE;
            } else if (endGameInfos.isMultiplayer && endGameInfos.isAbandon) {
                endGameMessage = CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE;
            } else if (!endGameInfos.isGameWon) {
                endGameMessage = CLASSIC_MULTIPLAYER_LOST_MESSAGE;
                winFlag = LOSING_FLAG;
            }
            this.openEndGameDialog(endGameMessage, winFlag);
        });

        this.socketService.on('game images', async () => {
            await this.loadImages();
            this.drawService.setCanvasTransparent(this.blinkModifiedCanvas.nativeElement);
            this.drawService.setCanvasTransparent(this.blinkOriginalCanvas.nativeElement);
        });
    }

    private makePixelsBlinkOnCanvas(pixelsToBlink: number[], canvasToCopyFrom: HTMLCanvasElement, invertColors?: boolean) {
        this.drawService.setCanvasTransparent(this.blinkModifiedCanvas.nativeElement);
        const context = this.blinkModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        context.canvas.id = BLINK_ID;
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
            pixelsToBlink,
            canvasToCopyFrom,
            this.blinkModifiedCanvas.nativeElement,
            invertColors,
        );

        this.numberOfBlinkCalls++;
        setTimeout(() => {
            this.numberOfBlinkCalls--;
            if (this.numberOfBlinkCalls <= 0) {
                context.canvas.id = PAUSED_ID;
            }
        }, 3000);
    }

    private makePixelsBlinkOnCanvasCheat(pixelsToBlink: number[], canvasToCopyFrom: HTMLCanvasElement, canvasToCopyOn: HTMLCanvasElement) {
        this.drawService.setCanvasTransparent(this.blinkOriginalCanvas.nativeElement);
        const context = canvasToCopyOn.getContext('2d') as CanvasRenderingContext2D;
        context.canvas.id = 'blinkCheat';
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(pixelsToBlink, canvasToCopyFrom, canvasToCopyOn);
    }
}
