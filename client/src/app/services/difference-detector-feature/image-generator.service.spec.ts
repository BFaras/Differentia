import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';

import { BLACK_RGB, IMAGE_HEIGHT, IMAGE_WIDTH, NB_BIT_PER_PIXEL } from '@common/const';
import { ImageGeneratorService } from './image-generator.service';

describe('DifferenceImageGeneratorService', () => {
    const TEST_DIFFERENCES_ARRAY: number[] = [1, 788, 899];
    let imageGeneratorService: ImageGeneratorService;
    let mainCanvas: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        imageGeneratorService = TestBed.inject(ImageGeneratorService);
        mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
    });

    it('should return the right image according to the array sent', () => {
        let imageHasDifferencesPixelsAtRightPosition = true;
        let differenceImageData: Uint8ClampedArray = imageGeneratorService.generateImageFromPixelsDataArray(TEST_DIFFERENCES_ARRAY, mainCanvas).data;

        TEST_DIFFERENCES_ARRAY.forEach((pixelNb) => {
            for (let i = 0; i < NB_BIT_PER_PIXEL - 1; i++) {
                if (differenceImageData[pixelNb * NB_BIT_PER_PIXEL + i] != BLACK_RGB) {
                    imageHasDifferencesPixelsAtRightPosition = false;
                }
            }
        });

        expect(imageHasDifferencesPixelsAtRightPosition).toBeTruthy();
    });
});
