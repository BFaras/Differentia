import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { expect } from 'chai';
import { MouseHandlerService } from './mouse-handler.service';
import sinon = require('sinon');

describe('MouseHandlerService', () => {
    let mouseService: MouseHandlerService;
    let position: Position = { x: 0, y: 0 };
    let imageService: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray,
        modifiedImageData: new Uint8ClampedArray,
        imageWidth: 1,
        imageHeight: 1,
        offSet: 0,
    };


    beforeEach(async () => {
        mouseService = new MouseHandlerService();
        mouseService.updateImageData(imageService);
    });

    it('should be created', () => {
        const answer = mouseService.isValidClick(position);
        expect(answer).to.equals(false);
    });

    it('should called ', () => {
        let updateImagespy = sinon.spy(mouseService, 'updateImageData');
        updateImagespy.restore();
        mouseService.isValidClick(position);
        sinon.assert.calledWith(updateImagespy, imageService);
    });

    it('should called ', () => {
        let convertPositionspy = sinon.spy(mouseService, 'convertMousePositionToPixelNumber');
        convertPositionspy.restore();
        mouseService.isValidClick(position);
        sinon.assert.alwaysCalledWith(convertPositionspy, position);
    });

    it('should reset differencesHashmap and differencesFound array', () => {
        let differencesHashmap = mouseService.differencesHashmap;
        let differencesNumberFound = mouseService.differencesNumberFound;
        mouseService.resetData();
        expect(mouseService.differencesHashmap).to.equals(differencesHashmap);
        expect(mouseService.differencesNumberFound).to.equals(differencesNumberFound);
    });
    
});
