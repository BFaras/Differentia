import { RecordTime } from './record-time';

export class RecordTimesBoard {
    static readonly DEFAULT_SOLO_RECORD_TIMES = [new RecordTime('N/A', 'N/A'), new RecordTime('N/A', 'N/A'), new RecordTime('N/A', 'N/A')];
    static readonly DEFAULT_VERSUS_RECORD_TIMES = [new RecordTime('N/A', 'N/A'), new RecordTime('N/A', 'N/A'), new RecordTime('N/A', 'N/A')];

    recordTimesSolo: RecordTime[];
    recordTimesVersus: RecordTime[];

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
