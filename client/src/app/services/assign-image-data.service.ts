import { Injectable } from '@angular/core';
import { SafeValue } from '@angular/platform-browser';
@Injectable({
    providedIn: 'root',
})
export class AssignImageDataService {
    isImageObtained: boolean;
    urlImage: SafeValue;
    constructor() {}

    getIsImageObtained() {
        return this.isImageObtained;
    }

    getUrlImage() {
        return this.urlImage;
    }

    assignImageData(dataOfImage: { index: number; url: SafeValue }) {
        this.isImageObtained = true;
        this.urlImage = dataOfImage.url;
    }

    deleteImage() {
        this.isImageObtained = false;
        this.urlImage = '';
    }

    assignMultipleImageData(url: SafeValue) {
        this.isImageObtained = true;
        this.urlImage = url;
    }
}
