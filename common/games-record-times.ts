import { RecordTime } from '../server/app/classes/record-times';

export interface GameModeTimes {
    soloGameTimes: RecordTime[];
    multiplayerGameTimes: RecordTime[];
}