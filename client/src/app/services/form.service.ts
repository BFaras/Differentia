import { Injectable } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    gameForms: GameFormDescription[] = [
        new GameFormDescription('Car game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Bike game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('House game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Plane game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('TV game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Table game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Chair game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Clown game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Dog game', 'image', new RecordTimesBoard([], [])),
    ];
    constructor() {}
}
