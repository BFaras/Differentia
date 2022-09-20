import { Component, OnInit } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-editable-images',
    templateUrl: './editable-images.component.html',
    styleUrls: ['./editable-images.component.scss'],
})
export class EditableImagesComponent implements OnInit {
    firstImageObtained: boolean;
    secondImageObtained: boolean;
    multipleImageObtained: boolean;
    urlImageFirst: string;
    indexOfImageObtainedFirst: number;
    urlImageSecond: string;
    indexOfImageObtainedSecond: number;

    constructor(private editImagesService: EditImagesService) {}

    ngOnInit(): void {
        this.editImagesService.activatedEmitterUrlImageSingle.subscribe((dataOfImage) => {
            if (dataOfImage.index === 0) {
                this.firstImageObtained = true;
                this.urlImageFirst = dataOfImage.url;
                this.indexOfImageObtainedFirst = dataOfImage.index;
            }
            if (dataOfImage.index === 1) {
                this.secondImageObtained = true;
                this.urlImageSecond = dataOfImage.url;
                this.indexOfImageObtainedSecond = dataOfImage.index;
            }
        });

        this.editImagesService.activatedEmitterUrlImageBoth.subscribe((url) => {
            this.firstImageObtained = true;
            this.urlImageFirst = url;
            this.indexOfImageObtainedFirst = 0;
            this.secondImageObtained = true;
            this.urlImageSecond = url;
            this.indexOfImageObtainedSecond = 1;
        });

        this.editImagesService.activatedEmitterRemoveImage.subscribe((wantToDeleteImg) => {
            if (wantToDeleteImg === this.indexOfImageObtainedFirst) {
                this.firstImageObtained = false;
            }
            if (wantToDeleteImg === this.indexOfImageObtainedSecond) {
                this.secondImageObtained = false;
            }
        });
    }
}
