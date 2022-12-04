import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';

import { MergeImageCanvasHandlerService } from './merge-image-canvas-handler.service';

describe('MergeImageCanvasHandlerService', () => {
    let service: MergeImageCanvasHandlerService;
    let canvasMock: HTMLCanvasElement;
    let contextMock: CanvasRenderingContext2D;
    let leftCanvasIndex: number;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MergeImageCanvasHandlerService);
    });

    beforeAll(() => {
        canvasMock = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
        contextMock = canvasMock.getContext('2d')!;
        leftCanvasIndex = 0;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should test SetCanvas', () => {
        service.setLeftContextAndCanvas(contextMock, canvasMock);
        service.setRightContextAndCanvas(contextMock, canvasMock);
        const expectedLength = 2;
        expect(service['context']?.length).toEqual(expectedLength);
        expect(service['context']?.length).toEqual(expectedLength);
    });

    it('should test draw imageOnCanvas for left canvas', () => {
        service.setLeftContextAndCanvas(contextMock, canvasMock);
        const spyDrawImage = spyOn(service['context']![leftCanvasIndex], 'drawImage');
        service.drawImageOnCanvas(leftCanvasIndex);
        expect(spyDrawImage).toHaveBeenCalled();
    });

    it('should test draw imageOnCanvas for left canvas', async () => {
        service.setLeftContextAndCanvas(contextMock, canvasMock);
        const mockUrl = 'string';
        const spyWaitForImage = spyOn(service, 'waitForImageToLoad');
        service.initializeImage(mockUrl, leftCanvasIndex);
        expect(spyWaitForImage).toHaveBeenCalled();
    });

    it('should test obtain Url', async () => {
        service.setLeftContextAndCanvas(contextMock, canvasMock);
        expect(typeof service.obtainUrlForMerged(leftCanvasIndex)).toEqual('string');
    });

    it('should test wait Image load return image Promise', async () => {
        const imageMock = new Image();
        imageMock.src = 'imageSrc';
        expect(await service.waitForImageToLoad(imageMock)).not.toBeNull();
    });

    it('should test SetCanvas', () => {
        service.setLeftContextAndCanvas(contextMock, canvasMock);
        service.setRightContextAndCanvas(contextMock, canvasMock);
        const spy = spyOn(CanvasRenderingContext2D.prototype, 'clearRect').and.callFake(() => {});
        service.resetCanvas();
        expect(spy).toHaveBeenCalled();
    });
});
