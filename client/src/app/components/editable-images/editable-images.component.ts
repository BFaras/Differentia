import { Component, OnInit } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-editable-images',
    templateUrl: './editable-images.component.html',
    styleUrls: ['./editable-images.component.scss'],
})
export class EditableImagesComponent implements OnInit {
    imageObtenue: boolean = false;
    urlImage: string;

    constructor(private editImagesService: EditImagesService) {}

    ngOnInit(): void {
        this.editImagesService.activatedEmitterUrlImage.subscribe((url) => {
            this.imageObtenue = true;
            this.urlImage = url;
        });

        this.editImagesService.activatedEmitterRemoveImage.subscribe((wantToDeleteImg) => {
            if (wantToDeleteImg === true) {
                this.imageObtenue = false;
                console.log(this.imageObtenue);
            }
        });
    }
}
