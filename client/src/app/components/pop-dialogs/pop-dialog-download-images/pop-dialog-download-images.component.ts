/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';

@Component({
    selector: 'app-pop-dialog-download-images',
    templateUrl: './pop-dialog-download-images.component.html',
    styleUrls: ['./pop-dialog-download-images.component.scss'],
})
export class PopDialogDownloadImagesComponent implements OnInit {
    urlOfImage: string;

    constructor(private editImagesService: EditImagesService) {}
    ngOnInit(): void {}

    onClickUploadImage(event: any) {
        if (event.target.files) {
            const reader = new FileReader();
            const fileToRead = event.target.files[0];
            reader.readAsDataURL(fileToRead);
            if (this.editImagesService.verifyImageFormat(fileToRead)) {
                reader.onload = () => {
                    this.editImagesService.renderImage(reader);
                    this.urlOfImage = reader.result as string;
                    this.editImagesService.activatedEmitterUrlImage.emit(this.urlOfImage);
                };
            }
        }
    }
}
