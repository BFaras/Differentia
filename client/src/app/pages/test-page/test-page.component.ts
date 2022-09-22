import { Component } from '@angular/core';
import { DifferencesDetector } from '@app/classes/differences-detector';
import { Image } from 'canvas';

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent {
  readonly originalImage: Image = new Image();
  readonly diffImage: Image = new Image();
  let finalDifferencesImage: Image = new Image();

  constructor() {
    let diffDetector : DifferencesDetector;

    originalImage.src = "../../../assets/ImageBlanche.bmp";
    diffImage.src = "../../../assets/ImageDiff.bmp";

    diffDetector = new DifferencesDetector({originalImage: originalImage, modifiedImage: diffImage}, 0);
    finalDifferencesImage = diffDetector.differenceImageGenerator.getDifferencesImage();
   }
}
