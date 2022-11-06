import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';

import { PencilService } from './pencil.service';

fdescribe('PencilService', () => {
    let service: PencilService;
    let mainCanvas: HTMLCanvasElement;
    let contextMock: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PencilService);
    });

    beforeAll(() => {
        mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
        contextMock = mainCanvas.getContext('2d')!;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should obtain the pencil color and width of the left canvas', () => {
        const left = 0;
        const leftColor = 'blue';
        const leftWidth = 3;

        service['leftCanvasColor'] = leftColor;
        service['leftCanvasWidth'] = leftWidth;

        expect(service.obtainPencilColor(left)).toEqual(leftColor);
        expect(service.obtainPencilWidth(left)).toEqual(leftWidth);
    });

    it('should obtain  the pencil color and width of the right canvas', () => {
        const right = 1;
        const rightColor = 'blue';
        const rightWidth = 3;

        service['rightCanvasColor'] = rightColor;
        service['rightCanvasWidth'] = rightWidth;

        expect(service.obtainPencilColor(right)).toEqual(rightColor);
        expect(service.obtainPencilWidth(right)).toEqual(rightWidth);
    });

    it('should set the pencil color and width of the left canvas', () => {
        const left = 0;
        const leftColor = 'red';
        const leftWidth = 3;

        service.setColor(leftColor, left);
        service.setWidth(leftWidth, left);

        expect(service['leftCanvasColor']).toEqual(leftColor);
        expect(service['leftCanvasWidth']).toEqual(leftWidth);
    });

    it('should set the pencil color and width of the right canvas', () => {
        const right = 1;
        const rightColor = 'red';
        const rightWidth = 3;

        service.setColor(rightColor, right);
        service.setWidth(rightWidth, right);

        expect(service['rightCanvasColor']).toEqual(rightColor);
        expect(service['rightCanvasWidth']).toEqual(rightWidth);
    });

    it('should assign the left canvas with the right line cap', () => {
        const leftRes = 'round';
        const left = 0;

        service['pencilMode'] = ['write', 'erase'];

        expect(service.assignRightLineCap(left)).toEqual(leftRes);
    });

    it('should assign the right canvas with the right line cap', () => {
        const rightRes = 'square';
        const right = 1;

        service['pencilMode'] = ['write', 'erase'];

        expect(service.assignRightLineCap(right)).toEqual(rightRes);
    });

    it('should not assign a canvas with the wrong line cap', () => {
        const index = 0;

        service['pencilMode'] = ['wrongLineCap'];

        expect(service.assignRightLineCap(index)).toBeUndefined();
    });

    it('should the state of the pencil for the right canvas', () => {
        const pencilMode = 'write';
        const left = 0;

        service['pencilMode'] = ['erase', 'erase'];
        service.setStateOfPencilForRightCanvas(pencilMode, left);

        expect(service['pencilMode'][left]).toEqual(pencilMode);
    });

    it('sould get the state of the pencil on the left canvas', () => {
        const left = 0;

        service['pencilMode'] = ['write', 'erase'];
        service.getStateOfPencil(contextMock, left);

        expect(contextMock.globalCompositeOperation).toEqual('source-over');
    });

    it('sould get the state of the pencil on the left canvas', () => {
        const right = 1;

        service['pencilMode'] = ['write', 'erase'];
        service.getStateOfPencil(contextMock, right);

        expect(contextMock.globalCompositeOperation).toEqual('destination-out');
    });
});
