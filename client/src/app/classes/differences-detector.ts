import { Image } from 'canvas';

export class DifferencesDetector {
    originalImage: Image;
    modifiedImage: Image;
    radius: number;

    constructor(originalImage: Image, modifiedImage: Image, radius: number) {
        this.originalImage = originalImage;
        this.modifiedImage = modifiedImage;
        this.radius = radius;
    }
}
