import { Canvas } from 'canvas';

export interface CanvasToCompare {
    readonly originalImageCanvas: Canvas;
    readonly modifiedImageCanvas: Canvas;
}
