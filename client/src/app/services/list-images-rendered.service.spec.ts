import { TestBed } from '@angular/core/testing';
import { ImageRenderedInformations } from '@app/interfaces/image-rendered-informations';

import { ListImagesRenderedService } from './list-images-rendered.service';

describe('ListImagesRenderedService', () => {
    let service: ListImagesRenderedService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ListImagesRenderedService);
    });

    it('should emit a number through activatedEmitterRemoveImage ', () => {
        const fakeNumber = 10;
        const fakeUrl = 'fake';
        const fakeInfo: ImageRenderedInformations = {
            url: fakeUrl,
            index: fakeNumber,
        };
        expect(service.sendIdImageToRemove(fakeNumber)).toEqual(service['activatedEmitterRemoveImage'].emit(fakeNumber));
        expect(service.sendUrlImageBoth(fakeUrl)).toEqual(service['activatedEmitterUrlImageBoth'].emit(fakeUrl));
        expect(service.sendUrlImageSingle(fakeInfo)).toEqual(service['activatedEmitterUrlImageSingle'].emit(fakeInfo));
    });

    it('should return activitedEmitter when calling getIdImageToRemove ', () => {
        expect(service.getIdImageToRemoveObservable()).toEqual(service['activatedEmitterRemoveImage']);
    });

    it('should return activatedEmitterUrlImageSingle when calling getIdImageToRemove ', () => {
        expect(service.getDataImageSingleObservable()).toEqual(service['activatedEmitterUrlImageSingle']);
    });

    it('should return activitedEmitter when calling sendIdImageToRemove ', () => {
        expect(service.getDataImageMultipleObservable()).toEqual(service['activatedEmitterUrlImageBoth']);
    });
});
