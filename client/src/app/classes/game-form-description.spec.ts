import { GameFormDescription } from './game-form-description';
import { RecordTimesBoard } from './record-times-board';

describe('GameFormDescription', () => {
    it('should create an instance', () => {
        expect(new GameFormDescription('Name', 'Image', new RecordTimesBoard([], []))).toBeDefined();
    });
});
