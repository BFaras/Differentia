import { Injectable } from '@angular/core';
import { MODIFIED_IMAGE_POSITION, ORIGINAL_IMAGE_POSITION } from '@common/const';

const ROUND_LINE_CAP: CanvasLineCap = 'round';
const SQUARE_LINE_CAP: CanvasLineCap = 'square';
const WRITE_MODE = 'write';
const ERASE_MODE = 'erase';
@Injectable({
    providedIn: 'root',
})
export class PencilService {
    private leftCanvasWidth: number;
    private leftCanvasColor: string;
    private rightCanvasWidth: number;
    private rightCanvasColor: string;
    private pencilMode: string[];

    constructor() {
        this.pencilMode = [];
    }

    obtainPencilColor(index: number): string {
        if (index === ORIGINAL_IMAGE_POSITION) {
            return this.leftCanvasColor;
        } else {
            return this.rightCanvasColor;
        }
    }

    setColor(color: string, index: number): void {
        if (index === ORIGINAL_IMAGE_POSITION) {
            this.leftCanvasColor = color;
        } else if (index === MODIFIED_IMAGE_POSITION) {
            this.rightCanvasColor = color;
        }
    }

    setWidth(width: number, index: number): void {
        if (index === ORIGINAL_IMAGE_POSITION) {
            this.leftCanvasWidth = width;
        } else if (index === MODIFIED_IMAGE_POSITION) {
            this.rightCanvasWidth = width;
        }
    }

    obtainPencilWidth(index: number): number {
        if (index === ORIGINAL_IMAGE_POSITION) {
            return this.leftCanvasWidth;
        } else {
            return this.rightCanvasWidth;
        }
    }

    assignRightLineCap(indexCanvas: number) {
        if (this.pencilMode[indexCanvas] === WRITE_MODE) {
            return ROUND_LINE_CAP;
        } else if (this.pencilMode[indexCanvas] === ERASE_MODE) {
            return SQUARE_LINE_CAP;
        }
        return;
    }

    setStateOfPencilForRightCanvas(pencilMode: string, indexCanvas: number) {
        this.pencilMode[indexCanvas] = pencilMode;
    }

    getStateOfPencil(context: CanvasRenderingContext2D, indexCanvas: number) {
        if (this.pencilMode[indexCanvas] === ERASE_MODE) {
            context.globalCompositeOperation = 'destination-out';
        }

        if (this.pencilMode[indexCanvas] === WRITE_MODE) {
            context.globalCompositeOperation = 'source-over';
        }
    }
}
