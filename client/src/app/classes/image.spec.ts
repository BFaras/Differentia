import { ImageSize } from './image-size';

describe('ImageSize', () => {

    const widthTest: number = 10;
    const heightTest: number = 20;

    it('should create an instance', () => {
        expect(new ImageSize(widthTest, heightTest)).toBeTruthy();
    });
});
