import { Injectable } from '@angular/core';
import { ImageSize } from '@app/classes/image-size';
import { EditImagesService } from './edit-images.service';
@Injectable({
    providedIn: 'root',
})
export class VerifyImageService {
    imageToVerify = new Image();
    private imageSizeConstraint: ImageSize = new ImageSize(640, 480);

    constructor(private editImagesService: EditImagesService){}

    getImageToVerify(reader: FileReader) {
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

    verifyIfSentMultipleOrSingle(urlOfImage:string,imageInfo:any){
        console.log(urlOfImage);
        if (imageInfo.bothImage) {
            console.log(imageInfo.bothImage);
            this.editImagesService.activatedEmitterUrlImageBoth.emit(urlOfImage);
        } else {
            this.editImagesService.activatedEmitterUrlImageSingle.emit({ index: imageInfo.indexOfImage, url: urlOfImage });
            console.log(imageInfo.bothImage);
        }
    }
}
