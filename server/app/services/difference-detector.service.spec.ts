import { expect } from 'chai';
import * as fs from 'fs';
import { join } from 'path';
import * as sinon from 'sinon';

import { DEFAULT_OFFSET, IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { DifferenceDetectorService } from './difference-detector.service';

//Test positions in images test file
const SEVEN_DIFFS_WITH_OR_WITHOUT_OFFSET_TEST = 0;
const TWO_DIFFS_WITHOUT_OFFSET_ONE_DIFF_WITH_OFFSET_TEST = 1;

const ORIGINAL_IMAGE_POSITION = 0;
const MODIFIED_IMAGE_POSITION = 1;

const JSON_DATA = 'data';

describe('DifferenceDetectorService', () => {
    const DEFAULT_IMAGES_DATA: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray(),
        modifiedImageData: new Uint8ClampedArray(),
        imageWidth: IMAGE_WIDTH,
        imageHeight: IMAGE_HEIGHT,
        offSet: DEFAULT_OFFSET,
    };
    let images: Uint8ClampedArray[][] = [];

    beforeEach(async () => {
        try {
            const result = await fs.promises.readFile(join('testDifferentImages.json'), 'utf-8');
            images = JSON.parse(result).images;
        } catch (err: any) {
            console.log('Something went wrong trying to read the json file:' + err);
            throw new Error(err);
        }
    });

    it('should call generateDifferencesInformation on construction', () => {
        const diffDetector = new DifferenceDetectorService(DEFAULT_IMAGES_DATA);
        const spy = sinon.spy(diffDetector, <any>'generateDifferencesInformation');
        expect(spy.calledOnce);
    });

    it('should call countDifferences on construction', () => {
        const diffDetector = new DifferenceDetectorService(DEFAULT_IMAGES_DATA);
        const spy = sinon.spy(diffDetector, <any>'countDifferences');
        expect(spy.calledOnce);
    });

    it('should have 7 differences with 0 offset', () => {
        const NB_OF_DIFFERENCES_IN_TEST = 7;
        const TEST_OFFSET = 0;

        const imageDatas: ImageDataToCompare = {
            originalImageData: images[SEVEN_DIFFS_WITH_OR_WITHOUT_OFFSET_TEST][ORIGINAL_IMAGE_POSITION][JSON_DATA],
            modifiedImageData: images[SEVEN_DIFFS_WITH_OR_WITHOUT_OFFSET_TEST][MODIFIED_IMAGE_POSITION][JSON_DATA],
            imageWidth: IMAGE_WIDTH,
            imageHeight: IMAGE_HEIGHT,
            offSet: TEST_OFFSET,
        };
        const diffDetector = new DifferenceDetectorService(imageDatas);

        expect(diffDetector.getNbDifferences()).to.be.equal(NB_OF_DIFFERENCES_IN_TEST);
    });

    it('should have 7 differences with 9 offset', () => {
        const NB_OF_DIFFERENCES_IN_TEST = 7;
        const TEST_OFFSET = 9;

        const imageDatas: ImageDataToCompare = {
            originalImageData: images[SEVEN_DIFFS_WITH_OR_WITHOUT_OFFSET_TEST][ORIGINAL_IMAGE_POSITION][JSON_DATA],
            modifiedImageData: images[SEVEN_DIFFS_WITH_OR_WITHOUT_OFFSET_TEST][MODIFIED_IMAGE_POSITION][JSON_DATA],
            imageWidth: IMAGE_WIDTH,
            imageHeight: IMAGE_HEIGHT,
            offSet: TEST_OFFSET,
        };
        const diffDetector = new DifferenceDetectorService(imageDatas);

        expect(diffDetector.getNbDifferences()).to.be.equal(NB_OF_DIFFERENCES_IN_TEST);
    });

    it('should have 2 differences with 0 offset', () => {
        const NB_OF_DIFFERENCES_IN_TEST = 2;
        const TEST_OFFSET = 0;

        const imageDatas: ImageDataToCompare = {
            originalImageData: images[TWO_DIFFS_WITHOUT_OFFSET_ONE_DIFF_WITH_OFFSET_TEST][ORIGINAL_IMAGE_POSITION][JSON_DATA],
            modifiedImageData: images[TWO_DIFFS_WITHOUT_OFFSET_ONE_DIFF_WITH_OFFSET_TEST][MODIFIED_IMAGE_POSITION][JSON_DATA],
            imageWidth: IMAGE_WIDTH,
            imageHeight: IMAGE_HEIGHT,
            offSet: TEST_OFFSET,
        };
        const diffDetector = new DifferenceDetectorService(imageDatas);

        expect(diffDetector.getNbDifferences()).to.be.equal(NB_OF_DIFFERENCES_IN_TEST);
    });

    it('should have 1 differences with 5 offset', () => {
        const NB_OF_DIFFERENCES_IN_TEST = 1;
        const TEST_OFFSET = 5;

        const imageDatas: ImageDataToCompare = {
            originalImageData: images[TWO_DIFFS_WITHOUT_OFFSET_ONE_DIFF_WITH_OFFSET_TEST][ORIGINAL_IMAGE_POSITION][JSON_DATA],
            modifiedImageData: images[TWO_DIFFS_WITHOUT_OFFSET_ONE_DIFF_WITH_OFFSET_TEST][MODIFIED_IMAGE_POSITION][JSON_DATA],
            imageWidth: IMAGE_WIDTH,
            imageHeight: IMAGE_HEIGHT,
            offSet: TEST_OFFSET,
        };
        const diffDetector = new DifferenceDetectorService(imageDatas);

        expect(diffDetector.getNbDifferences()).to.be.equal(NB_OF_DIFFERENCES_IN_TEST);
    });
});
