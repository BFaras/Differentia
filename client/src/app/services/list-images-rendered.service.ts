import { EventEmitter, Injectable } from '@angular/core';
import { ImageRenderedInformations } from '@app/interfaces/image-rendered-informations';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class ListImagesRenderedService {
    private activatedEmitterUrlImageBoth: EventEmitter<string> = new EventEmitter<string>();
    private activatedEmitterUrlImageSingle: EventEmitter<ImageRenderedInformations> = new EventEmitter<ImageRenderedInformations>();
    private activatedEmitterRemoveImage: EventEmitter<number> = new EventEmitter<number>();

    sendUrlImageBoth(url: string) {
        this.activatedEmitterUrlImageBoth.emit(url);
    }

    sendUrlImageSingle(info: ImageRenderedInformations) {
        this.activatedEmitterUrlImageSingle.emit(info);
    }

    sendIdImageToRemove(id: number) {
        this.activatedEmitterRemoveImage.emit(id);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getIdImageToRemoveObservable(): Observable<any> {
        return this.activatedEmitterRemoveImage;
    }

    getDataImageSingleObservable(): Observable<ImageRenderedInformations> {
        return this.activatedEmitterUrlImageSingle;
    }

    getDataImageMultipleObservable(): Observable<string> {
        return this.activatedEmitterUrlImageBoth;
    }
}
