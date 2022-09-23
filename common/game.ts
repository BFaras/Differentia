import { Time } from '@common/time';

export interface Game {
    name: string;
    numberOfDifferences: number;
    times: Time[];
    images: string[]; // À changer à un certain point, je ne sais pas les images seront dans quel format
}