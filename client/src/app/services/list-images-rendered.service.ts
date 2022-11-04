import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class ListImagesRenderedService {
    private activatedEmitterUrlImageBoth: EventEmitter<string> = new EventEmitter<string>();
    private activatedEmitterUrlImageSingle: EventEmitter<{ index: number; url: string }> = new EventEmitter<{ index: number; url: string }>();
    private activatedEmitterRemoveImage: EventEmitter<number> = new EventEmitter<number>();

    sendUrlImageBoth(url: string) {
        this.activatedEmitterUrlImageBoth.emit(url);
    }

    sendUrlImageSingle(info: { index: number; url: string }) {
        this.activatedEmitterUrlImageSingle.emit(info);
    }

    sendIdImageToRemove(id: number) {
        this.activatedEmitterRemoveImage.emit(id);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getIdImageToRemoveObservable(): Observable<any> {
        return this.activatedEmitterRemoveImage;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDataImageSingleObservable(): Observable<{ index: number; url: string }> {
        return this.activatedEmitterUrlImageSingle;
    }

    getDataImageMultipleObservable(): Observable<string> {
        return this.activatedEmitterUrlImageBoth;
    }
}
