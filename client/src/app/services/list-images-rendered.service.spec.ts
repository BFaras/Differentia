import { TestBed } from '@angular/core/testing';

import { ListImagesRenderedService } from './list-images-rendered.service';

describe('ListImagesRenderedService', () => {
    let service: ListImagesRenderedService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ListImagesRenderedService);
    });

    it('should emit a number through activatedEmitterRemoveImage ', () => {
        let fakeNumber: number = 10;
        expect(service.sendIdImageToRemove(fakeNumber)).toEqual(service['activatedEmitterRemoveImage'].emit(fakeNumber));
    });

    it('should return activitedEmitter when calling getIdImageToRemove ', () => {
        expect(service.getIdImageToRemove()).toEqual(service['activatedEmitterRemoveImage']);
    });

    it('should return activatedEmitterUrlImageSingle when calling getIdImageToRemove ', () => {
        expect(service.getDataImageSingle()).toEqual(service['activatedEmitterUrlImageSingle']);
    });

    it('should return activitedEmitter when calling sendIdImageToRemove ', () => {
        expect(service.getDataImageMultiple()).toEqual(service['activatedEmitterUrlImageBoth']);
    });
});
