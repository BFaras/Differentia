import { Injectable } from '@angular/core';
import { Vec2 } from '@app/interfaces/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;

@Injectable({
    providedIn: 'root',
})
export class DrawService {
    context: CanvasRenderingContext2D;

    drawWord(word: string, mousePositionX: number, mousePositionY: number) {
        const startPosition: Vec2 = { x: mousePositionX , y: mousePositionY };
        const step = 20;
        this.context.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.context.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }
}
