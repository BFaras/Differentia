import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ClueHandlerService } from '@app/services/clue-handler.service';
import { DifferenceDetectionService } from '@app/services/difference-detection.service';
import { DrawService } from '@app/services/draw.service';
import { ImageGeneratorService } from '@app/services/image-generator.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { ClueInformations } from '@common/clue-informations';
import { CLASSIC_MODE, DEFAULT_USERNAME, IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
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
    const position: Position = { x: 10, y: 20 };
    let socketTestHelper: SocketTestHelper;
    const differencesFoundInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: [],
        isValidDifference: true,
        socketId: 'socket1',
        playerUsername: DEFAULT_USERNAME,
    };
    const firstImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    const secondImage: HTMLImageElement = new Image(IMAGE_WIDTH, IMAGE_HEIGHT);
    const differenceImage: HTMLImageElement[] = [firstImage, secondImage];

    beforeEach(async () => {
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
            'showCompassClue',
            'showQuadrantClue',
            'makePixelsBlinkOnCanvas',
            'makePixelsBlinkOnCanvasCheat',
            'incrementNumberOfBlinkCalls',
            'decrementNumberOfBlinkCalls',
        ]);
        imageGeneratorSpy = jasmine.createSpyObj('ImageGeneratorService', ['copyCertainPixelsFromOneImageToACanvas']);
        imageDifferenceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', ['waitForImageToLoad']);
        clueHandlerServiceMock = jasmine.createSpyObj('ClueHandlerService', ['findClueQuadrantPixels']);

        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [MatProgressSpinnerModule],
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
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.differentImages = differenceImage;

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

    it('should detect mouseEvent', () => {
        mouseEvent = {
            offsetX: position.x,
            offsetY: position.y,
            button: 0,
        } as MouseEvent;
        component.detectDifference(mouseEvent);
        expect(differenceServiceSpy['mouseHitDetect']).toHaveBeenCalled();
    });

    it('should call clickMessage, playSound and verifyGameFinished when there is an event valid click', () => {
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        component['configurePlayAreaSocket']();

        expect(differenceServiceSpy['clickMessage']).toHaveBeenCalled();
        expect(differenceServiceSpy['playSound']).toHaveBeenCalled();
        expect(differenceServiceSpy['verifyGameFinished']).toHaveBeenCalled();
    });

    it('should call makePixelsBlinkOnCanvas() from DrawService on Valid click event', () => {
        differencesFoundInfo.isValidDifference = true;
        differencesFoundInfo.differencePixelsNumbers = [5];
        component.mode = CLASSIC_MODE;
        component['isCheatActivated'] = false;
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        expect(drawServiceSpy.makePixelsBlinkOnCanvas).toHaveBeenCalled();
    });

    it('should call copyCertainPixelsFromOneImageToACanvas() from ImageGeneratorService on Valid click event', () => {
        differencesFoundInfo.isValidDifference = true;
        differencesFoundInfo.differencePixelsNumbers = [5];
        component.mode = CLASSIC_MODE;
        component['isCheatActivated'] = false;
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        expect(imageGeneratorSpy.copyCertainPixelsFromOneImageToACanvas).toHaveBeenCalled();
    });

    it('should not call makePixelsBlinkOnCanvas() from DrawService on Valid click event when isCheatActivated is true', () => {
        differencesFoundInfo.isValidDifference = true;
        differencesFoundInfo.differencePixelsNumbers = [5];
        component.mode = CLASSIC_MODE;
        component['isCheatActivated'] = true;
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        expect(drawServiceSpy.makePixelsBlinkOnCanvas).not.toHaveBeenCalled();
    });

    it('should not call makePixelsBlinkOnCanvas() from DrawService on Valid click event when the difference has not been found', () => {
        differencesFoundInfo.isValidDifference = false;
        differencesFoundInfo.differencePixelsNumbers = [5];
        component.mode = CLASSIC_MODE;
        component['isCheatActivated'] = false;
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        expect(drawServiceSpy.makePixelsBlinkOnCanvas).not.toHaveBeenCalled();
    });

    it('should handle clue key pressed and send get clue for player if not isMultiplayer', () => {
        const spy = spyOn(socketClientService, 'send');
        component.isMultiplayer = false;
        component.handleKeyboardClue();
        expect(spy).toHaveBeenCalledWith('get clue for player');
    });

    it('should handle clue key pressed and do not send get clue for player if isMultiplayer', () => {
        const spy = spyOn(socketClientService, 'send');
        component.isMultiplayer = true;
        component.handleKeyboardClue();
        expect(spy).not.toHaveBeenCalled();
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

    it('should handle a Clue with quadrant of difference event and call showQuadrantClue() from DrawService', () => {
        const clueInfos: ClueInformations = {
            clueAmountLeft: 2,
            clueDifferenceQuadrant: 6,
        };
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Clue with quadrant of difference', clueInfos);
        expect(drawServiceSpy.showQuadrantClue).toHaveBeenCalled();
    });

    it('should handle a Cheat pixel list event and call makePixelsBlinkOnCanvasCheat() from DrawService', () => {
        const pixelList = [0, 9, 12];
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Cheat pixel list', pixelList);
        expect(drawServiceSpy.makePixelsBlinkOnCanvasCheat).toHaveBeenCalled();
    });

    it('should call loadImages() from DrawService and not handleKeyboardCheat() on a game images event when cheat mode is off', () => {
        const spy = spyOn(component, 'handleKeyboardCheat').and.callFake(() => {});
        const spy2 = spyOn(component, <any>'loadImages');
        component['configurePlayAreaSocket']();
        component['isCheatActivated'] = false;
        socketTestHelper.peerSideEmit('game images');
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('should call loadImages() from DrawService on a game images event when cheat mode is on', () => {
        const spy = spyOn(component, <any>'loadImages');
        component['configurePlayAreaSocket']();
        component['isCheatActivated'] = true;
        socketTestHelper.peerSideEmit('game images');
        expect(spy).toHaveBeenCalled();
    });

    it('should call showCompassClue() from DrawService on a Clue with difference pixels event', () => {
        component['configurePlayAreaSocket']();
        socketTestHelper.peerSideEmit('Clue with difference pixels');
        expect(drawServiceSpy.showCompassClue).toHaveBeenCalled();
    });
});
