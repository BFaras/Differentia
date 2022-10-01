import { Component, Input, OnInit } from '@angular/core';
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
    urlImage: string;
    constructor(private editImagesService: ListImagesRenderedService,private assignImageDataService:AssignImageDataService) {}

    ngOnInit(): void {
        this.getDataSingleImage();

        this.getDataMultipleImage();

        this.getDeletedImageId();
    }

    updateIsImageObtainedAndUrl(){
        this.isImageObtained = this.assignImageDataService.getIsImageObtained()
        this.urlImage = this.assignImageDataService.getUrlImage()
    }

    getDataSingleImage() {
        this.editImagesService.getDataImageSingle().subscribe((dataOfImage) => {
            if (dataOfImage.index === this.idFromParent){
            this.assignImageDataService.assignImageData(dataOfImage);
            this.updateIsImageObtainedAndUrl();
        }
        });
    }

    getDataMultipleImage() {
        this.editImagesService.getDataImageMultiple().subscribe((url) => {
            this.assignImageDataService.assignMultipleImageData(url)
            this.updateIsImageObtainedAndUrl();
        });
    }

    getDeletedImageId() {
        this.editImagesService.getIdImageToRemove().subscribe((dataOfImage) => {
            if (dataOfImage === this.idFromParent) {
            this.assignImageDataService.deleteImage()
            this.updateIsImageObtainedAndUrl();
        }
        });
    }
}
