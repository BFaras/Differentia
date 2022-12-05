import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageSize } from '@app/classes/image-size';
import { POSITION_BITS_DATA } from '@app/const/client-consts';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { ListImagesRenderedService } from './list-images-rendered.service';
import { UploadFileService } from './upload-file.service';
@Injectable({
    providedIn: 'root',
})
export class VerifyImageService {
    imageToVerify = new Image();
    imageSizeConstraint: ImageSize = new ImageSize(IMAGE_WIDTH, IMAGE_HEIGHT);
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
        const bytes = new Uint8Array(buffer);
        const blob = new Blob([bytes.buffer]);
        this.imageToVerify.src = URL.createObjectURL(blob);
    }

    processBuffer(e: any) {
        const buffer = e.target!.result as ArrayBuffer;
        this.getBmp(buffer);
        this.transformByteToImage(buffer);
    }

    verifyRespectAllContraints(dialog: any, file: File) {
        if (this.verifyImageConstraint() && this.verifyImageFormat(file) && this.getBitDepth() === 24) {
            const imageToSend = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToVerify.src as string);
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
        const datav = new DataView(buffer);
        this.bitDepth = datav.getUint8(POSITION_BITS_DATA);
    }

    verifyImageWidthHeight(width: number, height: number) {
        return height === this.imageSizeConstraint.height && width === this.imageSizeConstraint.width;
    }

    verifyImageConstraint() {
        return this.verifyImageWidthHeight(this.imageToVerify.width, this.imageToVerify.height);
    }

    verifyIfSentMultipleOrSingle(urlOfImage: string, imageInfo: any) {
        if (imageInfo.bothImage) {
            this.editImagesService.activatedEmitterUrlImageBoth.emit(urlOfImage);
            this.uploadFileService.setOriginalImage(this.file);
            this.uploadFileService.setModifiedImage(this.file);
        } else {
            this.editImagesService.activatedEmitterUrlImageSingle.emit({ index: imageInfo.indexOfImage, url: urlOfImage });
            if (imageInfo.indexOfImage === 0) {
                this.uploadFileService.setOriginalImage(this.file);
            }
            if (imageInfo.indexOfImage === 1) {
                this.uploadFileService.setModifiedImage(this.file);
            }
        }
    }
}
