import { expect } from 'chai';
import { ImageDataToCompare } from '@common/image-data-to-compare';
import { DifferenceDetectorService } from './difference-detector.service';

describe('DifferenceDetectorService', () => {
    let service: DifferenceDetectorService;
    let imagesData: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray,
        modifiedImageData: new Uint8ClampedArray,
        imageWidth: 1,
        imageHeight: 1,
        offSet: 0,
    };

    beforeEach(async () => {
        service = new DifferenceDetectorService(imagesData);
    });

    it('should be created', () => {
        expect(service).to.be.true;
    });
});
