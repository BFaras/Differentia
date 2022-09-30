import { Component, Input, OnInit } from '@angular/core';
import { AssignImageDataService } from '@app/services/assign-image-data.service';
import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-modified-image',
    templateUrl: './modified-image.component.html',
    styleUrls: ['./modified-image.component.scss'],
})
export class ModifiedImageComponent implements OnInit {
    @Input() idFromParent: number;
    isImageObtained: boolean;
    urlImage: string;
    constructor(private editImagesService: EditImagesService,private assignImageDataService:AssignImageDataService) {}

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
