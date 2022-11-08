import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';

import { DrawingHistoryService } from './drawing-history.service';

describe('DrawingHistoryService', () => {
    let service: DrawingHistoryService;
    let mainCanvas: HTMLCanvasElement;
    let contextMock: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingHistoryService);
    });

    beforeAll(() => {
        mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
        contextMock = mainCanvas.getContext('2d')!;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the cancel history and the redo history', () => {
        const history = [[], []];

        service['cancelDrawingHistory'] = history;
        service['redoDrawingHistory'] = history;

        expect(service.getCancelDrawingHistory()).toEqual(history);
        expect(service.getRedoDrawingHistory()).toEqual(history);
    });

    it('should save canvas', () => {
        const left = 0;
        service.saveCanvas(contextMock, left);

        expect(service['context'][left]).toEqual(contextMock);
    });

    it('should cancel canvas', () => {
        const imageData: ImageData = new ImageData(IMAGE_WIDTH, IMAGE_HEIGHT);
        const history: ImageData[][] = [[imageData], [imageData]];
        const left = 0;

        service['context'][left] = contextMock;
        service['cancelDrawingHistory'] = history;
        service.cancelCanvas(left);

        expect(service['context'][left]).toEqual(contextMock);
    });

    it('should redo canvas', () => {
        const imageData: ImageData = new ImageData(IMAGE_WIDTH, IMAGE_HEIGHT);
        const history: ImageData[][] = [[imageData], [imageData]];
        const left = 0;

        service['context'][left] = contextMock;
        service['redoDrawingHistory'] = history;
        service.redoCanvas(left);

        expect(service['context'][left]).toEqual(contextMock);
    });
});
