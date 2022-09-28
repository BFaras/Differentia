import { Component, OnInit } from '@angular/core';
// import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-editable-images',
    templateUrl: './editable-images.component.html',
    styleUrls: ['./editable-images.component.scss'],
})
export class EditableImagesComponent implements OnInit {
    imagesIndex: number[] = [0, 1];
    ngOnInit(): void {}
}
