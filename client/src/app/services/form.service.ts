import { Injectable } from '@angular/core';
import { GameFormDescription } from '@app/classes/game-form-description';
import { RecordTime } from '@app/classes/record-time';
import { RecordTimesBoard } from '@app/classes/record-times-board';

@Injectable({
    providedIn: 'root',
})
export class FormService {
    gameForms: GameFormDescription[] = [
        new GameFormDescription(
            'Car game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'Bike game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'House game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'Plane game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'TV game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'Table game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'Chair game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'Chair game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
        new GameFormDescription(
            'Chair game',
            'image',
            new RecordTimesBoard(
                [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')],
                [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')],
            ),
        ),
    ];
    constructor() {}
}
