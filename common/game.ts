import { GameModeTimes } from './games-record-times';

export interface Game {
    name: string;
    numberOfDifferences: number;
    times: GameModeTimes;
    images: string[];
    differencesList: number[][];
}
