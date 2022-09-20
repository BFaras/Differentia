import { EventEmitter, Injectable } from '@angular/core';
import { ImageSize } from '@app/classes/image-size';

@Injectable({
    providedIn: 'root',
})
export class EditImagesService {
    activatedEmitterUrlImage = new EventEmitter<string>();
    activatedEmitterRemoveImage = new EventEmitter<boolean>();

    imageToVerify = new Image();
    private imageSizeConstraint: ImageSize = new ImageSize(640, 480);

    renderImage(reader: FileReader) {
        this.imageToVerify.src = reader.result as string;
    }

    verifyImageFormat(file: File) {
        return file.type === 'image/bmp';
    }

    verifyImageWidthHeight(width: number, height: number) {
        return height === this.imageSizeConstraint.height && width === this.imageSizeConstraint.width;
    }

    verifyImageConstraint() {
        return this.verifyImageWidthHeight(this.imageToVerify.width, this.imageToVerify.height);
    }
}
