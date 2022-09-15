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

    getDiffercences() {
        const originalImageCanvas = document.createElement('canvas').getContext('2d');
        const modifiedImageCanvas = document.createElement('canvas').getContext('2d');

        originalImageCanvas.canvas.width = this.originalImage.width;
        modifiedImageCanvas8.canvas.width = this.modifiedImage.width;

        originalImageCanvas.drawImage(this.originalImage, 0, 0);
        modifiedImageCanvas.drawImage(this.modifiedImage, 0, 0);

        const dataOriginal = originalImageCanvas.getImageData(0, 0, this.originalImage.width, this.originalImage.height);
        const dataModified = modifiedImageCanvas.getImageData(0, 0, this.modifiedImage.width, this.modifiedImage.height);

        const different = [];

        const NB_PIXELS = 4;
        for (let y = 0; y < this.originalImage.height; y++) {
            for (let x = 0; x < this.originalImage.width; x++) {
                const pos = x * NB_PIXELS + y * (this.originalImage.width * NB_PIXELS);
                for (let i = 0; i < NB_PIXELS; i++) {
                    if (dataOriginal[pos + i] !== dataModified[pos + 1]) {
                        different.push({ x, y });
                    }
                }
            }
        }
    }
}
