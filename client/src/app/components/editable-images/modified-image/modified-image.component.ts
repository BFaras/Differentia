import { Component, OnInit } from '@angular/core';
import { EditImagesService } from '@app/services/edit-images.service';
@Component({
  selector: 'app-modified-image',
  templateUrl: './modified-image.component.html',
  styleUrls: ['./modified-image.component.scss']
})
export class ModifiedImageComponent implements OnInit {
  secondImageObtained: boolean;
  urlImageSecond: string;
  indexOfImageObtainedSecond: number;
  constructor(private editImagesService: EditImagesService) {}

  ngOnInit(): void {
    this.editImagesService.activatedEmitterUrlImageSingle.subscribe((dataOfImage) => {
      if (dataOfImage.index === 1) {
          this.secondImageObtained = true;
          this.urlImageSecond = dataOfImage.url;
          this.indexOfImageObtainedSecond = dataOfImage.index;
      }
  });

  this.editImagesService.activatedEmitterUrlImageBoth.subscribe((url) => {
    this.secondImageObtained = true;
    this.urlImageSecond = url;
    this.indexOfImageObtainedSecond = 1;
});

  this.editImagesService.activatedEmitterRemoveImage.subscribe((wantToDeleteImg) => {
    if (wantToDeleteImg === this.indexOfImageObtainedSecond) {
        this.secondImageObtained = false;
    }
});


  }

}
