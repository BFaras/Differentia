import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';

import { ImageGeneratorService } from '@app/services/image-generator.service';
import { BLACK_RGB, IMAGE_HEIGHT, IMAGE_WIDTH, NB_BIT_PER_PIXEL } from '@common/const';

describe('DifferenceImageGeneratorService', () => {
    const TEST_DIFFERENCES_ARRAY: number[] = [1, 788, 899];
    let imageGeneratorService: ImageGeneratorService;
    let mainCanvas: HTMLCanvasElement;
    let otherCanvas: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        imageGeneratorService = TestBed.inject(ImageGeneratorService);
        mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
        otherCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
    });

    it('should return the right image according to the array sent', () => {
        let imageHasDifferencesPixelsAtRightPosition = true;
        const differenceImageData: Uint8ClampedArray = imageGeneratorService.generateBlackImageFromPixelsDataArray(
            TEST_DIFFERENCES_ARRAY,
            mainCanvas,
        ).data;

        TEST_DIFFERENCES_ARRAY.forEach((pixelNb) => {
            for (let i = 0; i < NB_BIT_PER_PIXEL - 1; i++) {
                if (differenceImageData[pixelNb * NB_BIT_PER_PIXEL + i] != BLACK_RGB) {
                    imageHasDifferencesPixelsAtRightPosition = false;
                }
            }
        });

        expect(imageHasDifferencesPixelsAtRightPosition).toBeTruthy();
    });

    it('should copy the pixels positions from one canvas to another', () => {
        mainCanvas.getContext('2d')!.fillStyle = 'white';
        otherCanvas.getContext('2d')!.fillStyle = 'black';
        imageGeneratorService.copyCertainPixelsFromOneImageToACanvas(TEST_DIFFERENCES_ARRAY, mainCanvas, otherCanvas);

        const canvasCopiedData: Uint8ClampedArray = mainCanvas.getContext('2d')!.getImageData(0, 0, mainCanvas.width, mainCanvas.height).data;
        const canvasDrawnOnData: Uint8ClampedArray = mainCanvas.getContext('2d')!.getImageData(0, 0, otherCanvas.width, otherCanvas.height).data;

        let imageHasSamePixelsAtCopiedPosition = true;
        TEST_DIFFERENCES_ARRAY.forEach((pixelNb) => {
            for (let i = 0; i < NB_BIT_PER_PIXEL - 1; i++) {
                if (canvasCopiedData[pixelNb * NB_BIT_PER_PIXEL + i] != canvasDrawnOnData[pixelNb * NB_BIT_PER_PIXEL + i]) {
                    imageHasSamePixelsAtCopiedPosition = false;
                }
            }
        });

        expect(imageHasSamePixelsAtCopiedPosition).toBeTruthy();
    });
});
