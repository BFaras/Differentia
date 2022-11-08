import { TestBed } from '@angular/core/testing';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { Subject } from 'rxjs';
import { CommunicationService } from './communication.service';
import { UploadFileService } from './upload-file.service';
import SpyObj = jasmine.SpyObj;

class MockImage {
    src: string;
}

describe('UploadFileService', () => {
    const testFileName = 'filename';
    const testImageSrc1 = 'asa base64 src : src;,src,src';
    const testImageSrc2 = 'src : src;,base64,src,src';
    const testNameOfGame = 'game123New';
    let mockFile: File;
    let mockEmitterhttpPost: Subject<Object>;
    let service: UploadFileService;
    let communicationServiceSpy: SpyObj<CommunicationService>;

    beforeEach(() => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['uploadFiles']);
        mockEmitterhttpPost = new Subject<Object>();
        TestBed.configureTestingModule({
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
        });
        service = TestBed.inject(UploadFileService);
        mockFile = new File([''], testFileName, { type: 'text/html' });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should verify getter and setter of original Image', () => {
        service.setOriginalImage(mockFile);
        expect(service.getNameOriginalImage()).toEqual(mockFile);
    });

    it('should verify getter and setter of modified Image', () => {
        service.setModifiedImage(mockFile);
        expect(service.getNameModifiedImage()).toEqual(mockFile);
    });

    it('should verify if I go through uploadFiles nad reach subscribe inside', () => {
        const spy = communicationServiceSpy.uploadFiles.and.returnValue(mockEmitterhttpPost);
        service.upload(mockFile, 0);
        mockEmitterhttpPost.next({ value: 123 });
        expect(spy).toHaveBeenCalled();
    });

    it('should call setOriginalImage() on setOriginalMergedCanvasImage() with an image source with image64 before the first ,', () => {
        const spy = spyOn(service, 'setOriginalImage');
        const mockImage = new MockImage();
        mockImage.src = testImageSrc1;
        service['nameOriginalImage'] = mockFile;

        service.setOriginalMergedCanvasImage(mockImage as unknown as HTMLImageElement);
        expect(spy).toHaveBeenCalled();
    });

    it('should call setOriginalImage() on setOriginalMergedCanvasImage() with an image source with image64 after the first ,', () => {
        const spy = spyOn(service, 'setOriginalImage');
        const mockImage = new MockImage();
        mockImage.src = testImageSrc2;
        service['nameOriginalImage'] = mockFile;

        service.setOriginalMergedCanvasImage(mockImage as unknown as HTMLImageElement);
        expect(spy).toHaveBeenCalled();
    });

    it('should call setModifiedImage() on setOriginalMergedCanvasImage() ,', () => {
        const spy = spyOn(service, 'setModifiedImage');
        const mockImage = new MockImage();
        mockImage.src = testImageSrc1;
        service['nameModifiedImage'] = mockFile;

        service.setModifiedMergedCanvasImage(mockImage as unknown as HTMLImageElement);
        expect(spy).toHaveBeenCalled();
    });

    it('should set nameOfImageToUploadOriginal to right value on setNameImageUpload() when index is 0', () => {
        const indexOfImage = ORIGINAL_IMAGE_POSITION;

        service['nameOriginalImage'] = mockFile;
        service['nameOfGame'] = testNameOfGame;

        service.setNameImageUpload(indexOfImage);
        expect(service['nameOfImageToUploadOriginal']).toEqual(testNameOfGame + '_' + indexOfImage + '_' + mockFile.name);
    });

    it('should set nameOfImageToUploadModified to right value on setNameImageUpload() when index is 1', () => {
        const indexOfImage = MODIFIED_IMAGE_POSITION;

        service['nameModifiedImage'] = mockFile;
        service['nameOfGame'] = testNameOfGame;

        service.setNameImageUpload(indexOfImage);
        expect(service['nameOfImageToUploadModified']).toEqual(testNameOfGame + '_' + indexOfImage + '_' + mockFile.name);
    });

    it('should get the name of the original image to upload on index 0 for getNameImageUpload()', () => {
        service['nameOfImageToUploadOriginal'] = testNameOfGame;
        expect(service.getNameImageUpload(ORIGINAL_IMAGE_POSITION)).toEqual(testNameOfGame);
    });

    it('should get the name of the modified image to upload on index 1 for getNameImageUpload()', () => {
        service['nameOfImageToUploadModified'] = testNameOfGame;
        expect(service.getNameImageUpload(MODIFIED_IMAGE_POSITION)).toEqual(testNameOfGame);
    });

    it('should return nothing on index > 1 for getNameImageUpload()', () => {
        expect(service.getNameImageUpload(MODIFIED_IMAGE_POSITION + 1)).toBeUndefined();
    });
});
