import { Component, OnInit } from '@angular/core';
// import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-list-images-rendered',
    templateUrl: './list-images-rendered.component.html',
    styleUrls: ['./list-images-rendered.component.scss'],
})
export class ListImagesRenderedComponent implements OnInit {
    imagesIndex: number[] = [0, 1];
    ngOnInit(): void {}
}
