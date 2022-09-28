import { Component, Input, OnInit } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';
@Component({
    selector: 'app-modified-image',
    templateUrl: './modified-image.component.html',
    styleUrls: ['./modified-image.component.scss'],
})
export class ModifiedImageComponent implements OnInit {
    @Input() idFromParent: number;
    secondImageObtained: boolean;
    urlImageSecond: string;
    constructor(private editImagesService: EditImagesService) {}

    ngOnInit(): void {
        this.getDataSingleImage();

        this.getDataMultipleImage();

        this.getDeletedImageId();
    }

    assignImageData(dataOfImage: { index: number; url: string }) {
        if (dataOfImage.index === this.idFromParent) {
            this.secondImageObtained = true;
            this.urlImageSecond = dataOfImage.url;
        }
    }

    deleteImage(dataOfImage: number) {
        if (dataOfImage === this.idFromParent) {
            this.secondImageObtained = false;
        }
    }

    assignMultipleImageData(url: string) {
        this.secondImageObtained = true;
        this.urlImageSecond = url;
    }
    // le test undefined est pour sauter le test de subscription: Il faut le get avec http et changer la logic pour get directement ces donnees FUCK
    getDataSingleImage() {
        this.editImagesService.getDataImageSingle().subscribe((dataOfImage) => {
            this.assignImageData(dataOfImage);
        });
    }

    getDataMultipleImage() {
        this.editImagesService.getDataImageMultiple().subscribe((url) => {
            this.assignMultipleImageData(url);
        });
    }

    getDeletedImageId() {
        this.editImagesService.getIdImageToRemove().subscribe((dataOfImage) => {
            this.deleteImage(dataOfImage);
        });
    }
}
