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

    constructor(@Inject(MAT_DIALOG_DATA) private imageInfo: any, private verifyImageService: VerifyImageService) {}

    onClickUploadImage(event: any) {
        const target = event.target as HTMLInputElement;
        let file = target.files![0];
        if (file.type === 'image/bmp') {
            this.verifyImageService.setFile(file);
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = (e) => {
                this.verifyImageService.processBuffer(e);
                this.verifyImageService.getImage().onload = () => {
                    this.warningActivated = this.verifyImageService.verifyRespectAllContraints(this.imageInfo, file);
                };
            };
        } else {
            this.warningActivated = true;
        }
    }
}
