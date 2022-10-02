import { Component, OnInit } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';

@Component({
  selector: 'app-original-image',
  templateUrl: './original-image.component.html',
  styleUrls: ['./original-image.component.scss']
})
export class OriginalImageComponent implements OnInit {
  firstImageObtained: boolean;
  urlImageFirst: string;
  indexOfImageObtainedFirst: number;
  constructor(private editImagesService: EditImagesService) {}

  ngOnInit(): void {
    this.editImagesService.activatedEmitterUrlImageSingle.subscribe((dataOfImage) => {
      if (dataOfImage.index === 0) {
          this.firstImageObtained = true;
          this.urlImageFirst = dataOfImage.url;
          this.indexOfImageObtainedFirst = dataOfImage.index;
          }    
    });

    this.editImagesService.activatedEmitterUrlImageBoth.subscribe((url) => {
      this.firstImageObtained = true;
      this.urlImageFirst = url;
      this.indexOfImageObtainedFirst = 0;
  });

    this.editImagesService.activatedEmitterRemoveImage.subscribe((wantToDeleteImg) => {
      if (wantToDeleteImg === this.indexOfImageObtainedFirst) {
          this.firstImageObtained = false;
      }
  }) 

}
}
