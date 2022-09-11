import { RecordTime } from './record-time';

export class RecordTimesBoard {
    public recordTimesSolo: RecordTime[];
    public recordTimesVersus: RecordTime[];

    constructor(soloRecord: RecordTime[], versusRecords: RecordTime[]) {
        this.recordTimesSolo = [new RecordTime('02:00', 'Mark'), new RecordTime('02:00', 'Jean'), new RecordTime('02:00', 'Paul')];
        this.recordTimesVersus = [new RecordTime('02:00', 'Brook'), new RecordTime('02:00', 'Leon'), new RecordTime('02:00', 'Mike')];
    }
}
