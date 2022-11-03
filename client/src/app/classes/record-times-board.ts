import { RecordTime } from './record-time';

export class RecordTimesBoard {
    public static readonly DEFAULT_SOLO_RECORD_TIMES = [
        new RecordTime('02:00', 'Mark'),
        new RecordTime('02:00', 'Jean'),
        new RecordTime('02:00', 'Paul'),
    ];
    public static readonly DEFAULT_VERSUS_RECORD_TIMES = [
        new RecordTime('02:00', 'Brook'),
        new RecordTime('02:00', 'Leon'),
        new RecordTime('02:00', 'Mike'),
    ];

    public recordTimesSolo: RecordTime[];
    public recordTimesVersus: RecordTime[];

    constructor(soloRecord: RecordTime[], versusRecords: RecordTime[]) {
        if (this.isArrayEmpty(soloRecord)) {
            this.recordTimesSolo = [...RecordTimesBoard.DEFAULT_SOLO_RECORD_TIMES];
        } else {
            this.recordTimesSolo = soloRecord;
        }

        if (this.isArrayEmpty(versusRecords)) {
            this.recordTimesVersus = [...RecordTimesBoard.DEFAULT_VERSUS_RECORD_TIMES];
        } else {
            this.recordTimesVersus = versusRecords;
        }
    }

    private isArrayEmpty(array: RecordTime[]) {
        return array.length == 0;
    }
}
