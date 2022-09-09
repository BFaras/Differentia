import { RecordTime } from './record-time';

export interface FormDescription {
    gameName: string;
    gameImage: string;
    recordTimeSolo: RecordTime[];
    recordTimeVersus: RecordTime[];
}
