/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';

@Component({
    selector: 'app-pop-dialog-download-images',
    templateUrl: './pop-dialog-download-images.component.html',
    styleUrls: ['./pop-dialog-download-images.component.scss'],
})
export class PopDialogDownloadImagesComponent {
    urlOfImage: string;

    constructor(private editImagesService: EditImagesService) {}

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
                        this.editImagesService.activatedEmitterUrlImage.emit(this.urlOfImage);
                    }
                };
            };
        }
    }
}
