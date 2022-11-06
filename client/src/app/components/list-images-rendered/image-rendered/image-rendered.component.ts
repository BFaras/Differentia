import { Component, Input, OnInit } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';
import { ImageRenderedInformations } from '@app/interfaces/image-rendered-informations';
import { AssignImageDataService } from '@app/services/assign-image-data.service';
import { ListImagesRenderedService } from '@app/services/list-images-rendered.service';
@Component({
    selector: 'app-image-rendered',
    templateUrl: './image-rendered.component.html',
    styleUrls: ['./image-rendered.component.scss'],
})
export class ImageRenderedComponent implements OnInit {
    @Input() idFromParent: number;
    isImageObtained: boolean;
    urlImage: SafeValue;
    constructor(private editImagesService: ListImagesRenderedService, private assignImageDataService: AssignImageDataService) {}

    ngOnInit(): void {
        this.getDataSingleImage();

        this.getDataMultipleImage();

        this.getDeletedImageId();
    }

    updateIsImageObtainedAndUrl() {
        this.isImageObtained = this.assignImageDataService.getIsImageObtained();
        this.urlImage = this.assignImageDataService.getUrlImage();
    }

    getDataSingleImage() {
        this.editImagesService.getDataImageSingleObservable().subscribe((dataOfImage: ImageRenderedInformations) => {
            if (dataOfImage.index === this.idFromParent) {
                this.assignImageDataService.assignImageData(dataOfImage);
                this.updateIsImageObtainedAndUrl();
            }
        });
    }

    getDataMultipleImage() {
        this.editImagesService.getDataImageMultipleObservable().subscribe((url: SafeValue) => {
            this.assignImageDataService.assignMultipleImageData(url);
            this.updateIsImageObtainedAndUrl();
        });
    }

    getDeletedImageId() {
        this.editImagesService.getIdImageToRemoveObservable().subscribe((dataOfImage: number) => {
            if (dataOfImage === this.idFromParent) {
                this.assignImageDataService.deleteImage();
                this.updateIsImageObtainedAndUrl();
            }
        });
    }
}
