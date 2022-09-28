import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root',
})
export class EditImagesService {
    activatedEmitterUrlImageBoth = new EventEmitter<string>();
    activatedEmitterUrlImageSingle = new EventEmitter<{ index: number; url: string }>();
    activatedEmitterRemoveImage = new EventEmitter<number>();

    sendIdImageToRemove(id: number) {
        this.activatedEmitterRemoveImage.emit(id);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getIdImageToRemove(): Observable<any> {
        return this.activatedEmitterRemoveImage;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDataImageSingle(): Observable<{ index: number; url: string }> {
        return this.activatedEmitterUrlImageSingle;
    }

    getDataImageMultiple(): Observable<string> {
        return this.activatedEmitterUrlImageBoth;
    }
}
