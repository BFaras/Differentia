import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Coordinate } from '@app/interfaces/coordinate';
import { DifferenceDetectionService } from '@app/services/difference-detection.service';
import { DrawService } from '@app/services/draw.service';
import { ImageGeneratorService } from '@app/services/image-generator.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ClueInformations } from '@common/clue-informations';
import {
    CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE,
    CLASSIC_MULTIPLAYER_LOST_MESSAGE,
    CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE,
    CLASSIC_SOLO_END_GAME_MESSAGE,
    DEFAULT_HEIGHT_CANVAS,
    DEFAULT_WIDTH_CANVAs,
    MODIFIED_IMAGE_POSITION,
    ORIGINAL_IMAGE_POSITION,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { PopDialogEndgameComponent } from '../pop-dialogs/pop-dialog-endgame/pop-dialog-endgame.component';

const CHEAT_KEY: string = 'document:keyup.t';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements OnInit {
    @ViewChild('originalCanvas', { static: false }) originalCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('modifiedCanvas', { static: false }) modifiedCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('clickCanvas1', { static: false }) clickCanvas1!: ElementRef<HTMLCanvasElement>;
    @ViewChild('clickCanvas2', { static: false }) clickCanvas2!: ElementRef<HTMLCanvasElement>;
    @ViewChild('blinkCanvas', { static: false }) blinkCanvas!: ElementRef<HTMLCanvasElement>;
    @Input() differentImages: HTMLImageElement[];
    @Input() localPlayerUsername: string;
    @Input() isMultiplayer: boolean;
    mousePosition: Position = { x: 0, y: 0 };
    private blinkCanvasOrginial: ImageData;
    private canvasSize: Coordinate = { x: DEFAULT_WIDTH_CANVAs, y: DEFAULT_HEIGHT_CANVAS };
    constructor(
        private socketService: SocketClientService,
        private readonly drawService: DrawService,
        private readonly mouseDetection: DifferenceDetectionService,
        private imageToImageDifferenceService: ImageToImageDifferenceService,
        private dialog: MatDialog,
        private imageGenerator: ImageGeneratorService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.socketService.connect();
        this.configurePlayAreaSocket();

        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[ORIGINAL_IMAGE_POSITION]);
        await this.imageToImageDifferenceService.waitForImageToLoad(this.differentImages[MODIFIED_IMAGE_POSITION]);

        this.displayImages();

        this.blinkCanvasOrginial = this.blinkCanvas.nativeElement
            .getContext('2d')!
            .getImageData(0, 0, this.blinkCanvas.nativeElement.width, this.blinkCanvas.nativeElement.height);
    }

    private displayImages() {
        this.drawService.context1 = this.clickCanvas1.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context1.drawImage(this.differentImages[ORIGINAL_IMAGE_POSITION], 0, 0);
        this.clickCanvas1.nativeElement.focus();

        this.drawService.context2 = this.clickCanvas2.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context2.drawImage(this.differentImages[MODIFIED_IMAGE_POSITION], 0, 0);
        this.clickCanvas2.nativeElement.focus();

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
    //CHEAT_KEY à mettre dans le document des constantes du client (yeah une fois que ca va marcher for sure ;))
    @HostListener(CHEAT_KEY, ['$event'])
    handleKeyboardCheat() {
        this.socketService.send('Cheat key pressed');
    }

    private configurePlayAreaSocket(): void {
        this.socketService.on('Valid click', (differencesInfo: GameplayDifferenceInformations) => {
            const isLocalPlayer = differencesInfo.socketId == this.socketService.socket.id;

            let isDifference: boolean = differencesInfo.isValidDifference;
            this.mouseDetection.playSound(isDifference, isLocalPlayer);
            this.mouseDetection.clickMessage(isDifference, isLocalPlayer);
            this.mouseDetection.verifyGameFinished(isDifference, this.isMultiplayer, isLocalPlayer);

            if (isDifference) {
                this.makePixelsBlinkOnCanvas(differencesInfo.differencePixelsNumbers, this.modifiedCanvas.nativeElement);

                this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(
                    differencesInfo.differencePixelsNumbers,
                    this.originalCanvas.nativeElement,
                    this.modifiedCanvas.nativeElement,
                );
            }
        });

        // To test Charles
        this.socketService.on('Cheat pixel list', (pixelList: number[]) => {
            this.makePixelsBlinkOnCanvas(pixelList, this.originalCanvas.nativeElement);
        });

        //To test Raph
        this.socketService.on('Clue with quadrant of difference', (clueInformations: ClueInformations) => {});

        //To test Raph
        this.socketService.on('Clue with difference pixels', (differenceNotFoundPixels: number[]) => {});

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

    private makePixelsBlinkOnCanvas(pixelsToBlink: number[], canvasToCopyFrom: HTMLCanvasElement) {
        this.blinkCanvas.nativeElement.getContext('2d')?.putImageData(this.blinkCanvasOrginial, 0, 0);
        this.drawService.context5 = this.blinkCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawService.context5.canvas.id = 'blink';
        this.imageGenerator.copyCertainPixelsFromOneImageToACanvas(pixelsToBlink, canvasToCopyFrom, this.blinkCanvas.nativeElement);
        setTimeout(() => {
            this.drawService.context5.canvas.id = 'paused';
        }, 3000);
    }
}
