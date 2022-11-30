import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { BLINK_ID, PAUSED_ID, THREE_SECONDS } from '@app/const/client-consts';
import { CompassInformations } from '@app/interfaces/compass-informations';
import { DrawService } from '@app/services/draw.service';
import { ClueInformations } from '@common/clue-informations';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs } from '@common/const';
import { ClueHandlerService } from './clue-handler.service';
import { ImageGeneratorService } from './image-generator.service';
import SpyObj = jasmine.SpyObj;

describe('DrawService', () => {
    const diffCluePixelsTest = [5];
    let service: DrawService;
    let clueHandlerService: ClueHandlerService;
    let ctxStub: CanvasRenderingContext2D;
    let imageGeneratorSpy: SpyObj<ImageGeneratorService>;

    beforeEach(() => {
        imageGeneratorSpy = jasmine.createSpyObj('ImageGeneratorService', ['copyCertainPixelsFromOneImageToACanvas']);

        TestBed.configureTestingModule({ providers: [{ provide: ImageGeneratorService, useValue: imageGeneratorSpy }] });
        service = TestBed.inject(DrawService);
        clueHandlerService = TestBed.inject(ClueHandlerService);
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH_CANVAs, DEFAULT_HEIGHT_CANVAS).getContext('2d') as CanvasRenderingContext2D;
        service.contextClickOriginalCanvas = ctxStub;
        service.contextClickModifiedCanvas = ctxStub;
        jasmine.clock().install();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.contextClickOriginalCanvas.canvas.width).toEqual(DEFAULT_WIDTH_CANVAs);
        expect(service.contextClickModifiedCanvas.canvas.width).toEqual(DEFAULT_WIDTH_CANVAs);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.contextClickOriginalCanvas.canvas.height).toEqual(DEFAULT_HEIGHT_CANVAS);
        expect(service.contextClickModifiedCanvas.canvas.height).toEqual(DEFAULT_HEIGHT_CANVAS);
    });

    it(' drawWord should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.contextClickOriginalCanvas, 'fillText').and.callThrough();
        const message = 'text';
        const expectedCallTimes = message.length;
        service.drawWord(message, { x: 0, y: 0 }, ctxStub);
        expect(fillTextSpy).toHaveBeenCalled();
        expect(fillTextSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawWord should call fillText on the canvas', fakeAsync(() => {
        const eraseTextSpy = spyOn(service.contextClickOriginalCanvas, 'clearRect').and.callThrough();
        const message = 'text';
        service.drawWord(message, { x: 0, y: 0 }, ctxStub);
        tick(1500);
        expect(eraseTextSpy).toHaveBeenCalled();
    }));

    it('should call clearRect from the canvas context', fakeAsync(() => {
        const canvasMock = CanvasTestHelper.createCanvas(DEFAULT_WIDTH_CANVAs, DEFAULT_HEIGHT_CANVAS);
        const spy = spyOn(canvasMock.getContext('2d')!, 'clearRect');
        service.setCanvasTransparent(canvasMock);
        expect(spy).toHaveBeenCalled();
    }));

    it('should call getCompassInformationsForClue() from ClueHandlerService on showCompassClue()', async () => {
        const fakeCompassInfo: CompassInformations = {
            compassClueImage: new Image(),
            isDifferenceClueMiddle: false,
        };
        const spy = spyOn(clueHandlerService, 'getCompassInformationsForClue').and.returnValue(Promise.resolve(fakeCompassInfo));
        await service.showCompassClue(diffCluePixelsTest, ctxStub.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('should call drawImageOnMiddleOfCanvas() from ClueHandlerService on showCompassClue() when clue difference is in the middle', async () => {
        const fakeCompassInfo: CompassInformations = {
            compassClueImage: new Image(),
            isDifferenceClueMiddle: true,
        };
        const spy = spyOn(service, <any>'drawImageOnMiddleOfCanvas');
        spyOn(clueHandlerService, 'getCompassInformationsForClue').and.returnValue(Promise.resolve(fakeCompassInfo));
        await service.showCompassClue(diffCluePixelsTest, ctxStub.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('should call drawImageOnMiddleOfCanvas() from ClueHandlerService on showCompassClue() when clue difference is not in the middle', async () => {
        const fakeCompassInfo: CompassInformations = {
            compassClueImage: new Image(),
            isDifferenceClueMiddle: false,
        };
        const spy = spyOn(service, <any>'drawImageOnMiddleOfCanvas');
        spyOn(clueHandlerService, 'getCompassInformationsForClue').and.returnValue(Promise.resolve(fakeCompassInfo));
        await service.showCompassClue(diffCluePixelsTest, ctxStub.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('should change the canvas id to paused even if makePixelsBlinkOnCanvas is called two times', () => {
        const pixelsToBlink = [1, 2, 3];
        service.makePixelsBlinkOnCanvas(pixelsToBlink, service.contextClickOriginalCanvas.canvas, service.contextClickOriginalCanvas.canvas);
        jasmine.clock().tick(1000);
        service.makePixelsBlinkOnCanvas(pixelsToBlink, service.contextClickOriginalCanvas.canvas, service.contextClickOriginalCanvas.canvas);
        jasmine.clock().tick(3000);
        expect(service.contextClickOriginalCanvas.canvas.id).toEqual('paused');
    });

    it('should handle a Clue with quadrant of difference event and call makePixelsBlinkOnCanvas()', () => {
        const clueInfos: ClueInformations = {
            clueAmountLeft: 2,
            clueDifferenceQuadrant: 6,
        };
        const spy = spyOn(service, 'makePixelsBlinkOnCanvas').and.callFake(() => {});
        service.showQuadrantClue(clueInfos, service.contextClickOriginalCanvas.canvas, service.contextClickOriginalCanvas.canvas);
        expect(spy).toHaveBeenCalled();
    });

    it('should set the canvas ID to blink then to paused on makePixelsBlinkOnCanvas()', () => {
        const testPixelsToBlink: number[] = [2, 5, 6];
        service.makePixelsBlinkOnCanvas(testPixelsToBlink, service.contextClickOriginalCanvas.canvas, service.contextClickOriginalCanvas.canvas);
        expect(service.contextClickOriginalCanvas.canvas.id).toEqual(BLINK_ID);
        jasmine.clock().tick(THREE_SECONDS);
        expect(service.contextClickOriginalCanvas.canvas.id).toEqual(PAUSED_ID);
    });

    it('should calll copyCertainPixelsFromOneImageToACanvas() from ImageGenerator on makePixelsBlinkOnCanvasCheat()', () => {
        const testPixelsToBlink: number[] = [2, 5, 6];
        service.makePixelsBlinkOnCanvasCheat(testPixelsToBlink, service.contextClickOriginalCanvas.canvas, service.contextClickOriginalCanvas.canvas);
        expect(imageGeneratorSpy.copyCertainPixelsFromOneImageToACanvas).toHaveBeenCalled();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });
});
