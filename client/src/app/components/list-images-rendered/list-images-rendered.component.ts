import { Component } from '@angular/core';
import { MODIFIED_IMAGE_NAME, MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_NAME, ORIGINAL_IMAGE_POSITION } from '@common/const';
@Component({
    selector: 'app-list-images-rendered',
    templateUrl: './list-images-rendered.component.html',
    styleUrls: ['./list-images-rendered.component.scss'],
})
export class ListImagesRenderedComponent {
    imagesIndex: number[] = [ORIGINAL_IMAGE_POSITION, MODIFIED_IMAGE_POSITION];
    nameImageList: string[] = [ORIGINAL_IMAGE_NAME, MODIFIED_IMAGE_NAME];
}
