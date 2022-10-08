import { Time } from '@common/time';

export interface Game {
    name: string;
    numberOfDifferences: number;
    times: Time[];
    images: string[];
    differencesList: number[][];
}
