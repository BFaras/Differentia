import { RecordTime } from './record-time';

export class RecordTimesBoard {
    time: string;
    playerName: string;

    constructor(public recordTimesSolo: RecordTime[], public recordTimesVersus: RecordTime[]) {
        recordTimesSolo = [
            new RecordTime(this.time, this.playerName),
            new RecordTime(this.time, this.playerName),
            new RecordTime(this.time, this.playerName),
            new RecordTime(this.time, this.playerName),
        ];
        recordTimesVersus = [
            new RecordTime(this.time, this.playerName),
            new RecordTime(this.time, this.playerName),
            new RecordTime(this.time, this.playerName),
            new RecordTime(this.time, this.playerName),
        ];
    }
}
