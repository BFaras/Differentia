import { Injectable } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTimesBoard } from '@app/classes/record-times-board';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    gameForms: GameFormDescription[] = [
        new GameFormDescription('Car game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Car game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Car game', 'image', new RecordTimesBoard([], [])),
        new GameFormDescription('Car game', 'image', new RecordTimesBoard([], [])),
    ];
    constructor() {}
}
