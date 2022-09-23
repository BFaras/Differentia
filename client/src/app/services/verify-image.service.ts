import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageSize } from '@app/classes/image-size';
import { EditImagesService } from './edit-images.service';
@Injectable({
    providedIn: 'root',
})
export class VerifyImageService {
    private imageToVerify = new Image();
    private imageSizeConstraint: ImageSize = new ImageSize(640, 480);
    private bitDepth:number
    private warningActivated:boolean;
    constructor(private editImagesService: EditImagesService,private sanitizer: DomSanitizer){}

    transformByteToImage(buffer : any) {
        let bytes = new Uint8Array(buffer)
        let blob = new Blob([bytes.buffer])
        this.imageToVerify.src = URL.createObjectURL(blob);
    }

    processBuffer(e:ProgressEvent<FileReader>){
        let buffer = e.target!.result as ArrayBuffer
        this.getBmp(buffer);
        this.transformByteToImage(buffer);
    }

    sendImageRespetContraints(dialog:any,file:File){
        if (this.verifyImageConstraint() && this.verifyImageFormat(file) && this.bitDepth == 24) {
            let imageToSend = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageToVerify.src as string)
            this.verifyIfSentMultipleOrSingle(imageToSend as string,dialog)

            this.warningActivated = false;
        } else {
            this.warningActivated = true
        }
    }

    getWarningActivated(){
        return this.warningActivated;
    }
    getImage(){
        return this.imageToVerify;
    }
    verifyImageFormat(file: File) {
        console.log(file)
        return file.type === 'image/bmp';
    }

    getBmp(buffer: any){
        let datav = new DataView(buffer)
        this.bitDepth =  datav.getUint8(28);
    }

    verifyImageWidthHeight(width: number, height: number) {
        console.log(width)
        console.log(height)
        return height === this.imageSizeConstraint.height && width === this.imageSizeConstraint.width;
    }

    verifyImageConstraint() {
        return this.verifyImageWidthHeight(this.imageToVerify.width, this.imageToVerify.height);
    }

    verifyIfSentMultipleOrSingle(urlOfImage:string,imageInfo:any){
        if (imageInfo.bothImage) {
            this.editImagesService.activatedEmitterUrlImageBoth.emit(urlOfImage);
        } else {
            this.editImagesService.activatedEmitterUrlImageSingle.emit({ index: imageInfo.indexOfImage, url: urlOfImage });
        }
    }
}
