import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class EditImagesService {
    activatedEmitterUrlImage = new EventEmitter<string>();
    activatedEmitterRemoveImage = new EventEmitter<boolean>();
}
