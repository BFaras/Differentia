import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    BLINK_ID,
    COMPASS_BLINK_MILISECONDS,
    COMPASS_CLUE_ID,
    PAUSED_ID,
    STANDARD_POP_UP_HEIGHT,
    STANDARD_POP_UP_WIDTH,
} from '@app/const/client-consts';
import { Coordinate } from '@app/interfaces/coordinate';
import { ChatMessagesService } from '@app/services/chat-messages.service';
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
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { PopDialogAbandonVerificationComponent } from '../pop-dialogs/pop-dialog-abandon-verification/pop-dialog-abandon-verification.component';

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
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    reloadState: boolean = true;
    constructor(
        private socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: DifferenceDetectionService,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private dialog: MatDialog,
        private imageGenerator: ImageGeneratorService,
        private chatMessageService: ChatMessagesService,
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

    detectDifference(event: MouseEvent) {
        this.mouseDetection.mouseHitDetect(event);
    }

    onCreateVerifyAbandonGamePopDialog() {
        this.dialog.open(PopDialogAbandonVerificationComponent, {
            height: STANDARD_POP_UP_HEIGHT,
            width: STANDARD_POP_UP_WIDTH,
            data: {
                gameMode: this.mode,
            },
        });
    }

    private async loadImages(): Promise<void> {
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);
        this.reloadState = false;
        this.displayImages();
        this.setClickCanvasesTransparent();
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

    // Ajouter de la verification pour le chat
    // Oublier la fonction que le prof a conseiller, onChange? onActive?
    @HostListener(CHEAT_KEY, ['$event'])
    handleKeyboardCheat() {
        if (this.isCheatActivated && !this.chatMessageService.isWriting) {
            this.deactivateCheatMode();
        } else if (!this.chatMessageService.isWriting) {
            this.activateCheatMode();
        }
    }

    @HostListener(CLUE_KEY, ['$event'])
    handleKeyboardClue() {
        if (!this.isMultiplayer) {
            this.socketService.send('get clue for player');
        }
    }

    private configurePlayAreaSocket(): void {
        this.socketService.on('Valid click', (differencesInfo: GameplayDifferenceInformations) => {
            const isLocalPlayer = differencesInfo.socketId == this.socketService.socket.id;

            const isDifference: boolean = differencesInfo.isValidDifference;
            this.mouseDetection.playSound(isDifference, isLocalPlayer);
            this.mouseDetection.clickMessage(isDifference, isLocalPlayer);
            this.mouseDetection.verifyGameFinished(isDifference, this.isMultiplayer, isLocalPlayer);

            if (isDifference && this.mode === CLASSIC_MODE) {
                if (!this.isCheatActivated)
                    this.drawService.makePixelsBlinkOnCanvas(
                        differencesInfo.differencePixelsNumbers,
                        this.blinkModifiedCanvas.nativeElement,
                        this.modifiedCanvas.nativeElement,
                    );

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
            this.drawService.makePixelsBlinkOnCanvasCheat(pixelList, this.originalCanvas.nativeElement, this.blinkModifiedCanvas.nativeElement);
            this.drawService.makePixelsBlinkOnCanvasCheat(pixelList, this.modifiedCanvas.nativeElement, this.blinkOriginalCanvas.nativeElement);
        });

        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {
            this.drawService.showQuadrantClue(clueInformations, this.blinkModifiedCanvas.nativeElement, this.modifiedCanvas.nativeElement);
        });

        this.socketService.on('Clue with difference pixels', async (differenceCluePixels: number[]) => {
            await this.drawService.showCompassClue(differenceCluePixels, this.blinkModifiedCanvas.nativeElement);

            this.blinkModifiedCanvas.nativeElement.id = BLINK_ID;
            this.drawService.incrementNumberOfBlinkCalls();
            setTimeout(() => {
                this.drawService.decrementNumberOfBlinkCalls();
                this.blinkModifiedCanvas.nativeElement.id = COMPASS_CLUE_ID;
            }, COMPASS_BLINK_MILISECONDS);
        });

        this.socketService.on('game images', async () => {
            await this.loadImages();
            this.drawService.setCanvasTransparent(this.blinkModifiedCanvas.nativeElement);
            this.drawService.setCanvasTransparent(this.blinkOriginalCanvas.nativeElement);
            if (this.isCheatActivated) {
                this.isCheatActivated = false;
                this.handleKeyboardCheat();
            }
        });
    }

    private activateCheatMode() {
        this.socketService.send('Cheat key pressed');
        this.isCheatActivated = !this.isCheatActivated;
    }

    private deactivateCheatMode() {
        const originalContext = this.blinkOriginalCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        originalContext.canvas.id = PAUSED_ID;
        const modifiedContext = this.blinkModifiedCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        modifiedContext.canvas.id = PAUSED_ID;
        this.isCheatActivated = !this.isCheatActivated;
    }
}
