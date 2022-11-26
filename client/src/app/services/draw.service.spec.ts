import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CompassInformations } from '@app/interfaces/compass-informations';
import { DrawService } from '@app/services/draw.service';
import { DEFAULT_HEIGHT_CANVAS, DEFAULT_WIDTH_CANVAs } from '@common/const';
import { ClueHandlerService } from './clue-handler.service';

describe('DrawService', () => {
    const diffCluePixelsTest = [5];
    let service: DrawService;
    let clueHandlerService: ClueHandlerService;
    let ctxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawService);
        clueHandlerService = TestBed.inject(ClueHandlerService);
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH_CANVAs, DEFAULT_HEIGHT_CANVAS).getContext('2d') as CanvasRenderingContext2D;
        service.contextClickOriginalCanvas = ctxStub;
        service.contextClickModifiedCanvas = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.contextClickOriginalCanvas.canvas.width).toEqual(DEFAULT_WIDTH_CANVAs);
        expect(service.contextClickModifiedCanvas.canvas.width).toEqual(DEFAULT_WIDTH_CANVAs);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.contextClickOriginalCanvas.canvas.height).toEqual(DEFAULT_WIDTH_CANVAs);
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

    it('should call getCompassInformationsForClue() from ClueHandlerService on showCompassClue()', async (done) => {
        const fakeCompassInfo: CompassInformations = {
            compassClueImage: new Image(),
            isDifferenceClueMiddle: false,
        };
        const spy = spyOn(clueHandlerService, 'getCompassInformationsForClue').and.returnValue(Promise.resolve(fakeCompassInfo));
        await service.showCompassClue(diffCluePixelsTest, ctxStub.canvas);
        expect(spy).toHaveBeenCalled();
        done();
    });

    it('should call drawImageOnMiddleOfCanvas() from ClueHandlerService on showCompassClue() when clue difference is in the middle', async (done) => {
        const fakeCompassInfo: CompassInformations = {
            compassClueImage: new Image(),
            isDifferenceClueMiddle: true,
        };
        const spy = spyOn(service, <any>'drawImageOnMiddleOfCanvas');
        spyOn(clueHandlerService, 'getCompassInformationsForClue').and.returnValue(Promise.resolve(fakeCompassInfo));
        await service.showCompassClue(diffCluePixelsTest, ctxStub.canvas);
        expect(spy).toHaveBeenCalled();
        done();
    });

    it('should call drawImageOnMiddleOfCanvas() from ClueHandlerService on showCompassClue() when clue difference is not in the middle', async (done) => {
        const fakeCompassInfo: CompassInformations = {
            compassClueImage: new Image(),
            isDifferenceClueMiddle: false,
        };
        const spy = spyOn(service, <any>'drawImageOnMiddleOfCanvas');
        spyOn(clueHandlerService, 'getCompassInformationsForClue').and.returnValue(Promise.resolve(fakeCompassInfo));
        await service.showCompassClue(diffCluePixelsTest, ctxStub.canvas);
        expect(spy).toHaveBeenCalled();
        done();
    });
});
