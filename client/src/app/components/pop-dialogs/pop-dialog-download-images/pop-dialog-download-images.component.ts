/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VerifyImageService } from '@app/services/verify-image.service';

@Component({
    selector: 'app-pop-dialog-download-images',
    templateUrl: './pop-dialog-download-images.component.html',
    styleUrls: ['./pop-dialog-download-images.component.scss'],
})
export class PopDialogDownloadImagesComponent {
    warningActivated: boolean = false;
    urlOfImage: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private imageInfo: any,
        private verifyImageService: VerifyImageService,
    ) {}

    onClickUploadImage(event: any) {
        if (event.target.files) {
            const reader = new FileReader();
            const fileToRead = event.target.files[0];
            console.log(fileToRead.readAsBinaryString);
            reader.readAsDataURL(fileToRead);

            reader.onload = () => {
                this.verifyImageService.getImageToVerify(reader);
                this.verifyImageService.imageToVerify.onload = () => {
                    if (this.verifyImageService.verifyImageConstraint() && this.verifyImageService.verifyImageFormat(fileToRead)) {
                        this.urlOfImage = reader.result as string;
                        this.warningActivated = false;
                        this.verifyImageService.verifyIfSentMultipleOrSingle(this.urlOfImage,this.imageInfo)
                    } else {
                        this.warningActivated = true;
                    }
                };


            };
        }
    }

}
