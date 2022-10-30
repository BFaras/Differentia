import { Injectable } from '@angular/core';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';

@Injectable({
    providedIn: 'root',
})
export class Renderer2TestHelper {
    createElement(elementToCreateName: string) {
        return CanvasTestHelper.createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
    }
}
