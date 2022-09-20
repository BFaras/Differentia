/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditImagesService } from '@app/services/edit-images.service';

@Component({
    selector: 'app-pop-dialog-download-images',
    templateUrl: './pop-dialog-download-images.component.html',
    styleUrls: ['./pop-dialog-download-images.component.scss'],
})
export class PopDialogDownloadImagesComponent {
    warningActivated: boolean = false;
    urlOfImage: string;

    constructor(private editImagesService: EditImagesService, @Inject(MAT_DIALOG_DATA) private imageInfo: any) {}

    onClickUploadImage(event: any) {
        if (event.target.files) {
            const reader = new FileReader();
            const fileToRead = event.target.files[0];
            reader.readAsDataURL(fileToRead);

            reader.onload = () => {
                this.editImagesService.renderImage(reader);
                this.editImagesService.imageToVerify.onload = () => {
                    if (this.editImagesService.verifyImageConstraint() && this.editImagesService.verifyImageFormat(fileToRead)) {
                        this.urlOfImage = reader.result as string;
                        this.warningActivated = false;
                        if (this.imageInfo.bothImage) {
                            this.editImagesService.activatedEmitterUrlImageBoth.emit(this.urlOfImage);
                        } else {
                            this.editImagesService.activatedEmitterUrlImageSingle.emit({ index: this.imageInfo.indexOfImage, url: this.urlOfImage });
                        }
                    } else {
                        this.warningActivated = true;
                    }
                };
            };
        }
    }
}
