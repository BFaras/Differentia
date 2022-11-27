import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE, CLASSIC_MULTIPLAYER_LOST_MESSAGE, CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE } from '@app/client-consts';
import { ClueHandlerService } from '@app/services/clue-handler.service';
import { DifferenceDetectionService } from '@app/services/difference-detection.service';
import { DrawService } from '@app/services/draw.service';
import { ImageGeneratorService } from '@app/services/image-generator.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ClueInformations } from '@common/clue-informations';
import { DEFAULT_USERNAME, IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { Socket } from 'socket.io-client';
import { PlayAreaComponent } from './play-area.component';
import SpyObj = jasmine.SpyObj;

class HTMLElementRefCanvasMock {
    nativeElement: HTMLCanvasElement;
    constructor() {
        this.nativeElement = CanvasTestHelper.createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    }
}

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let socketClientService: SocketClientService;
    let differenceServiceSpy: SpyObj<DifferenceDetectionService>;
    let drawServiceSpy: SpyObj<DrawService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let imageGeneratorSpy: SpyObj<ImageGeneratorService>;
    let imageDifferenceSpy: SpyObj<ImageToImageDifferenceService>;
    let clueHandlerServiceMock: SpyObj<ClueHandlerService>;
    let mouseEvent: MouseEvent;
    let position: Position = { x: 10, y: 20 };
    let socketTestHelper: SocketTestHelper;
    let endGameInfos: EndGameInformations;
    const differencesFoundInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: [],
        isValidDifference: true,
        socketId: 'socket1',
        playerUsername: DEFAULT_USERNAME,
    };
    let firstImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    let secondImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    let differenceImage: HTMLImageElement[] = [firstImage, secondImage];

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientService = new SocketClientService();
        socketClientService.socket = socketTestHelper as unknown as Socket;

        differenceServiceSpy = jasmine.createSpyObj('MouseDetectionService', ['mouseHitDetect', 'clickMessage', 'verifyGameFinished', 'playSound']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        drawServiceSpy = jasmine.createSpyObj('DrawService', [
            'contextClickOriginalCanvas',
            'contextClickModifiedCanvas',
            'drawWord',
            'setCanvasTransparent',
        ]);
        imageGeneratorSpy = jasmine.createSpyObj('ImageGeneratorService', ['copyCertainPixelsFromOneImageToACanvas']);
        imageDifferenceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', ['waitForImageToLoad']);
        clueHandlerServiceMock = jasmine.createSpyObj('ClueHandlerService', ['findClueQuadrantPixels']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: SocketClientService, useValue: socketClientService },
                { provide: DrawService, useValue: drawServiceSpy },
                { provide: DifferenceDetectionService, useValue: differenceServiceSpy },
                { provide: ImageToImageDifferenceService, useValue: imageDifferenceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: ImageGeneratorService, useValue: imageGeneratorSpy },
                { provide: ClueHandlerService, useValue: clueHandlerServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlayAreaComponent);
        jasmine.clock().install();
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.differentImages = differenceImage;
        TestBed.inject(SocketClientService);

        spyOn(CanvasRenderingContext2D.prototype, 'putImageData').and.callFake(() => {});
        component['blinkModifiedCanvas'] = new HTMLElementRefCanvasMock() as ElementRef<HTMLCanvasElement>;
        component['blinkOriginalCanvas'] = new HTMLElementRefCanvasMock() as ElementRef<HTMLCanvasElement>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call display images in ngOnInt', async () => {
        const spy = spyOn(component, <any>'displayImages');
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should set the canvas when displaying images ', () => {
        const originalSpy = spyOn(component.originalCanvas.nativeElement, 'focus');
        const clickCanvas1Spy = spyOn(component.clickOriginalCanvas.nativeElement, 'focus');
        const clickCanvas2Spy = spyOn(component.clickModifiedCanvas.nativeElement, 'focus');
        const modifiedCanvasSpy = spyOn(component.modifiedCanvas.nativeElement, 'focus');

        component['displayImages']();
        expect(originalSpy).toHaveBeenCalled();
        expect(modifiedCanvasSpy).toHaveBeenCalled();
        expect(clickCanvas1Spy).toHaveBeenCalled();
        expect(clickCanvas2Spy).toHaveBeenCalled();
    });

    it('should open dialog', () => {
        component['openEndGameDialog']('Hello', false);
        expect(matDialogSpy).toBeTruthy();
    });

    it('should detect mouseEvent', () => {
        mouseEvent = {
            offsetX: position.x,
            offsetY: position.y,
            button: 0,
        } as MouseEvent;
        component.detectDifference(mouseEvent);
        expect(differenceServiceSpy['mouseHitDetect']).toHaveBeenCalled();
    });

    it('should open end game Dialog ', () => {
        endGameInfos = {
            isMultiplayer: false,
            isAbandon: false,
            isGameWon: true,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalled();
    });

    it('should call clickMessage, playSound and verifyGameFinished when there is an event valid click', () => {
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        component['configurePlayAreaSocket']();

        expect(differenceServiceSpy['clickMessage']).toHaveBeenCalled();
        expect(differenceServiceSpy['playSound']).toHaveBeenCalled();
        expect(differenceServiceSpy['verifyGameFinished']).toHaveBeenCalled();
    });

    it('should set the context 5 to blink then to paused', () => {
        differencesFoundInfo.isValidDifference = true;
        differencesFoundInfo.differencePixelsNumbers = [];
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        component['configurePlayAreaSocket']();
        expect(component['blinkModifiedCanvas'].nativeElement.id).toEqual('blink');
        jasmine.clock().tick(3000);
        expect(component['blinkModifiedCanvas'].nativeElement.id).toEqual('paused');
    });

    it('should call end game event when the user win', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: false,
            isGameWon: true,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE);
    });

    it('should call end game event when the user abandon', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: true,
            isGameWon: false,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE);
    });

    it('should call end game event when the user lose', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: false,
            isGameWon: false,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('End game', endGameInfos);

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_LOST_MESSAGE);
    });

    it('should handle clue key pressed and send get clue for player', () => {
        const spy = spyOn(socketClientService, 'send');
        component.handleKeyboardClue();
        expect(spy).toHaveBeenCalledWith('get clue for player');
    });

    it('should handle cheat key pressed and send Cheat key pressed', () => {
        const spy = spyOn(socketClientService, 'send');
        component.handleKeyboardCheat();
        expect(spy).toHaveBeenCalledWith('Cheat key pressed');
    });

    it('should handle cheat key pressed and stop the blinking', () => {
        component['isCheatActivated'] = true;
        component.handleKeyboardCheat();
        expect(component['isCheatActivated']).toEqual(false);
    });

    it('should handle a Clue with quadrant of difference event and call makePixelsBlinkOnCanvas()', () => {
        const clueInfos: ClueInformations = {
            clueAmountLeft: 2,
            clueDifferenceQuadrant: 6,
        };
        const spy = spyOn(component, <any>'makePixelsBlinkOnCanvas').and.callFake(() => {});
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Clue with quadrant of difference', clueInfos);
        expect(spy).toHaveBeenCalled();
    });

    it('should handle a Cheat pixel list event and call makePixelsBlinkOnCanvasCheat()', () => {
        const pixelList = [0, 9, 12];
        const spy = spyOn(component, <any>'makePixelsBlinkOnCanvasCheat').and.callFake(() => {});
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Cheat pixel list', pixelList);
        expect(spy).toHaveBeenCalled();
    });

    it('should handle a Clue with difference pixels event and call makePixelsBlinkOnCanvas()', () => {
        const cluePixels = [1, 2, 3];
        const spy = spyOn(component, <any>'makePixelsBlinkOnCanvas').and.callFake(() => {});
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Clue with difference pixels', cluePixels);
        expect(spy).toHaveBeenCalled();
    });

    it('should change the canvas id to paused even if makePixelsBlinkOnCanvas is called two times', () => {
        const pixelsToBlink = [1, 2, 3];
        component['makePixelsBlinkOnCanvas'](pixelsToBlink, component['blinkOriginalCanvas'].nativeElement);
        jasmine.clock().tick(1000);
        component['makePixelsBlinkOnCanvas'](pixelsToBlink, component['blinkOriginalCanvas'].nativeElement);
        jasmine.clock().tick(3000);
        expect(component['blinkModifiedCanvas'].nativeElement.id).toEqual('paused');
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });
});
