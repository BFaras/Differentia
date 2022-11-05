import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageSize } from '@app/classes/image-size';
import { ImageRenderedInformations } from '@app/interfaces/image-rendered-informations';
import { CORRECT_BIT_DEPTH, CORRECT_IMAGE_FORMAT, MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';
import { ListImagesRenderedService } from './list-images-rendered.service';
import { UploadFileService } from './upload-file.service';
@Injectable({
    providedIn: 'root',
})
export class VerifyImageService {
    private imageToVerify = new Image();
    private imageSizeConstraint: ImageSize = new ImageSize(640, 480);
    private bitDepth: number;
    private file: File;
    constructor(
        private editImagesService: ListImagesRenderedService,
        private sanitizer: DomSanitizer,
        private uploadFileService: UploadFileService,
    ) {}

    setFile(file: File) {
        this.file = file;
    }

    private transformByteToImage(buffer: any) {
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
        if (this.verifyImageConstraint() && this.verifyImageFormat(file) && this.bitDepth == CORRECT_BIT_DEPTH) {
            let imageToSend = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToVerify.src as string);
            this.verifyIfSentMultipleOrSingle(imageToSend as string, dialog);

            return false;
        } else {
            return true;
        }
    }

    getImage() {
        return this.imageToVerify;
    }

    private verifyImageFormat(file: File) {
        return file.type === CORRECT_IMAGE_FORMAT;
    }

    private getBmp(buffer: any) {
        let datav = new DataView(buffer);
        this.bitDepth = datav.getUint8(28);
    }

    private verifyImageWidthHeight(width: number, height: number) {
        return height === this.imageSizeConstraint.height && width === this.imageSizeConstraint.width;
    }

    private verifyImageConstraint() {
        return this.verifyImageWidthHeight(this.imageToVerify.width, this.imageToVerify.height);
    }

    private verifyIfSentMultipleOrSingle(urlOfImage: string, imageInfo: any) {
        if (imageInfo.bothImage) {
            this.editImagesService.sendUrlImageBoth(urlOfImage);
        } else {
            const imageRenderedInfos: ImageRenderedInformations = { index: imageInfo.indexOfImage, url: urlOfImage };
            this.editImagesService.sendUrlImageSingle(imageRenderedInfos);
            console.log(imageInfo.indexOfImage);
            if (imageInfo.indexOfImage == ORIGINAL_IMAGE_POSITION) {
                this.uploadFileService.setOriginalImage(this.file, imageInfo.indexOfImage);
            }
            if (imageInfo.indexOfImage == MODIFIED_IMAGE_POSITION) {
                this.uploadFileService.setModifiedImage(this.file, imageInfo.indexOfImage);
            }
        }
    }
}
