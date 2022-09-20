import { Component, OnInit } from '@angular/core';
// import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-editable-images',
    templateUrl: './editable-images.component.html',
    styleUrls: ['./editable-images.component.scss'],
})
export class EditableImagesComponent implements OnInit {
    secondImageObtained: boolean;
    multipleImageObtained: boolean;
    urlImageSecond: string;
    indexOfImageObtainedSecond: number;

    // constructor(private editImagesService: EditImagesService) {}

    ngOnInit(): void {

        // this.editImagesService.activatedEmitterUrlImageBoth.subscribe((url) => {
        //     this.firstImageObtained = true;
        //     this.urlImageFirst = url;
        //     this.indexOfImageObtainedFirst = 0;
        //     this.secondImageObtained = true;
        //     this.urlImageSecond = url;
        //     this.indexOfImageObtainedSecond = 1;
        // });

    }
}
