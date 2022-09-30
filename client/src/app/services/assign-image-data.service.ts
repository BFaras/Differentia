import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssignImageDataService {
  isImageObtained: boolean;
  urlImage: string;
  constructor() { }

  getIsImageObtained(){
    return this.isImageObtained
  }

  getUrlImage(){
    return this.urlImage
  }

assignImageData(dataOfImage: { index: number; url: string }) {
        this.isImageObtained = true;
        this.urlImage = dataOfImage.url 
    

}

deleteImage() {
    this.isImageObtained = false;
    this.urlImage = ""

}

assignMultipleImageData(url: string) {
    this.isImageObtained = true;
    this.urlImage = url;
}
}
