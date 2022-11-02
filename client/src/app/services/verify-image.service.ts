import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageSize } from '@app/classes/image-size';
import { ListImagesRenderedService } from './list-images-rendered.service';
import { UploadFileService } from './upload-file.service';
@Injectable({
    providedIn: 'root',
})
export class VerifyImageService {
    imageToVerify = new Image();
    imageSizeConstraint: ImageSize = new ImageSize(640, 480);
    bitDepth: number;
    file: File;
    constructor(
        private editImagesService: ListImagesRenderedService,
        private sanitizer: DomSanitizer,
        private uploadFileService: UploadFileService,
    ) {}

    setFile(file: File) {
        this.file = file;
    }

    transformByteToImage(buffer: any) {
        let bytes = new Uint8Array(buffer);
        let blob = new Blob([bytes.buffer]);
        this.imageToVerify.src = URL.createObjectURL(blob);
    }

    processBuffer(e: any) {
        let buffer = e.target!.result as ArrayBuffer;
        this.getBmp(buffer);
        this.transformByteToImage(buffer);
    }

    verifyRespectAllContraints(dialog: any, file: File) {
        if (this.verifyImageConstraint() && this.verifyImageFormat(file) && this.getBitDepth() == 24) {
            let imageToSend = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToVerify.src as string);
            this.verifyIfSentMultipleOrSingle(imageToSend as string, dialog);

            return false;
        } else {
            return true;
        }
    }

    getBitDepth() {
        return this.bitDepth;
    }

    getImage() {
        return this.imageToVerify;
    }
    verifyImageFormat(file: File) {
        return file.type === 'image/bmp';
    }

    getBmp(buffer: any) {
        let datav = new DataView(buffer);
        this.bitDepth = datav.getUint8(28);
    }

    verifyImageWidthHeight(width: number, height: number) {
        return height === this.imageSizeConstraint.height && width === this.imageSizeConstraint.width;
    }

    verifyImageConstraint() {
        return this.verifyImageWidthHeight(this.imageToVerify.width, this.imageToVerify.height);
    }

    verifyIfSentMultipleOrSingle(urlOfImage: string, imageInfo: any) {
        if (imageInfo.bothImage) {
            this.editImagesService.sendUrlImageBoth(urlOfImage);
        } else {
            this.editImagesService.sendUrlImageSingle({ index: imageInfo.indexOfImage, url: urlOfImage });
            console.log(imageInfo.indexOfImage);
            if (imageInfo.indexOfImage == 0) {
                this.uploadFileService.setOriginalImage(this.file, imageInfo.indexOfImage);
            }
            if (imageInfo.indexOfImage == 1) {
                this.uploadFileService.setModifiedImage(this.file, imageInfo.indexOfImage);
            }
        }
    }
}
