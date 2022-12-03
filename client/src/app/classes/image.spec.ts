import { ImageSize } from './image-size';

describe('ImageSize', () => {
    const widthTest = 10;
    const heightTest = 20;

    it('should create an instance', () => {
        expect(new ImageSize(widthTest, heightTest)).toBeTruthy();
    });
});
