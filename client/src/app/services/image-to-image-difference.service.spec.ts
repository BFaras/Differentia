import { Renderer2 } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ImageToImageDifferenceService } from './image-to-image-difference.service';

describe('ImageToImageDifferenceService', () => {
    let service: ImageToImageDifferenceService;
    let renderer: Renderer2;
    let mainCanvas: HTMLCanvasElement;
    let originalImage: HTMLImageElement = new Image();
    let modifiedImage: HTMLImageElement = new Image();
    let differencesImageToPutDataIn: HTMLImageElement;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({ declarations: [ImageToImageDifferenceService] }).compileComponents();
    }));

    beforeEach(() => {
        TestBed.configureTestingModule({});
        mainCanvas = renderer.createElement('canvas');
        service = TestBed.inject(ImageToImageDifferenceService);
        originalImage.src = '../../assets/ImageBlanche.bmp';
        modifiedImage.src = '../../assets/image_7_diff.bmp';
    });

    // Pas trop certain de l'utilite
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call setupDataInService with the right attribute', () => {
        // service.setupDataInService()
    });

    it('should change the size of the canvas accordingly', () => {
        // service.adaptCanvasSizeToImage
    });

    it('should return the right image data', () => {
        // service.getImageData
    });
});
