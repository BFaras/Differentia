import { RecordTime } from './record-time';
import { RecordTimesBoard } from './record-times-board';

describe('RecordTimesBoard', () => {
    const testTimesBoard = [new RecordTime('02:00', 'Mario'), new RecordTime('02:00', 'Luigi'), new RecordTime('02:00', 'Sonic')];
    let recordTimesBoard: RecordTimesBoard;

    it('should create an instance', () => {
        recordTimesBoard = new RecordTimesBoard([], []);
        expect(recordTimesBoard).toBeTruthy();
    });

    it('should have default solo record times if we send an empty array of solo records', () => {
        recordTimesBoard = new RecordTimesBoard([], testTimesBoard);
        expect(recordTimesBoard.recordTimesSolo).toEqual(RecordTimesBoard.DEFAULT_SOLO_RECORD_TIMES);
    });

    it('should have default versus record times if we send an empty array of versus records', () => {
        recordTimesBoard = new RecordTimesBoard(testTimesBoard, []);
        expect(recordTimesBoard.recordTimesVersus).toEqual(RecordTimesBoard.DEFAULT_VERSUS_RECORD_TIMES);
    });

    it('should contain the record times we send in the constructor if not empty', () => {
        recordTimesBoard = new RecordTimesBoard(testTimesBoard, testTimesBoard);
        expect(recordTimesBoard.recordTimesSolo).toEqual(testTimesBoard);
        expect(recordTimesBoard.recordTimesVersus).toEqual(testTimesBoard);
    });
});
