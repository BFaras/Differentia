import { ImageDataToCompare } from '@common/image-data-to-compare';
import { Position } from '@common/position';
import { expect } from 'chai';
import { MouseHandlerService } from './mouse-handler.service';
import Sinon = require('sinon');

describe('MouseHandlerService', () => {
    let mouseService: MouseHandlerService;
    let position: Position = { x: 0, y: 0 };
    let imageService: ImageDataToCompare = {
        originalImageData: new Uint8ClampedArray(),
        modifiedImageData: new Uint8ClampedArray(),
        imageWidth: 1,
        imageHeight: 1,
        offSet: 0,
    };

    beforeEach(async () => {
        mouseService = new MouseHandlerService();
        mouseService.updateImageData(imageService);
        mouseService.differencesHashmap.set(0, 1);
        position = { x: 0, y: 0 };
    });

    it('should call generateDifferencesInformations on updateImageData', () => {
        const spy = Sinon.spy(mouseService, <any>'generateDifferencesInformations');
        expect(spy.called);
    });

    it('should return false if difference is already found ', () => {
        mouseService.differencesNumberFound = [1];
        expect(mouseService.isValidClick(position)).to.be.false;
    });

    it('should return true if difference is not already found ', () => {
        expect(mouseService.isValidClick(position)).to.be.true;
    });

    it('should return false if pixel is not a difference ', () => {
        position = { x: 2, y: 2 };
        expect(mouseService.isValidClick(position)).to.be.false;
    });

    it('should reset differencesHashmap and differencesFound array', () => {
        let differencesHashmapTest: Map<number, number> = new Map<number, number>();
        let differencesNumberFoundTest: number[] = [];

        mouseService.differencesNumberFound = [1, 2, 3];
        mouseService.resetData();
        expect(mouseService.differencesHashmap).to.deep.equals(differencesHashmapTest);
        expect(mouseService.differencesNumberFound).to.deep.equals(differencesNumberFoundTest);
    });
});
