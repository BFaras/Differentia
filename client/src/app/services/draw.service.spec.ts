import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawService } from '@app/services/draw.service';

describe('DrawService', () => {
    let service: DrawService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 540;
    const CANVAS_HEIGHT = 400;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.contextClickOriginalCanvas = ctxStub;
        service.contextClickModifiedCanvas = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.contextClickOriginalCanvas.canvas.width).toEqual(CANVAS_WIDTH);
        expect(service.contextClickModifiedCanvas.canvas.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.contextClickOriginalCanvas.canvas.height).toEqual(CANVAS_HEIGHT);
        expect(service.contextClickModifiedCanvas.canvas.height).toEqual(CANVAS_HEIGHT);
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
        const canvasMock = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const spy = spyOn(canvasMock.getContext('2d')!, 'clearRect');
        service.setCanvasTransparent(canvasMock);
        expect(spy).toHaveBeenCalled();
    }));
});
