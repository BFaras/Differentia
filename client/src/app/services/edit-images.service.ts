import { EventEmitter, Injectable } from '@angular/core';
import { ImageSize } from '@app/classes/image-size';

@Injectable({
    providedIn: 'root',
})
export class EditImagesService {
    activatedEmitterUrlImage = new EventEmitter<string>();
    activatedEmitterRemoveImage = new EventEmitter<boolean>();

    private imageSizeConstraint: ImageSize = new ImageSize(640, 480);

    verifyImageWidthHeight(width: number, height: number) {
        return height === this.imageSizeConstraint.height && width === this.imageSizeConstraint.width;
    }

    verifyImageFormat(file: File) {
        return file.type === 'image/bmp';
    }

    renderImage(reader: FileReader) {
        const image = new Image();
        image.src = reader.result as string;
        this.verifyImageSize(image);
    }

    verifyImageSize(imageToVerify: HTMLImageElement) {
        if (this.verifyImageWidthHeight(imageToVerify.width, imageToVerify.height)) {
            alert(imageToVerify.width);
            console.log(imageToVerify.width);
        }
    }
}
