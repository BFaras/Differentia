import { GameFormDescription } from './game-form-description';
import { RecordTimesBoard } from './record-times-board';

describe('GameFormDescription', () => {
    const gameName = 'Name';
    const gameImage = 'Image';
    const recordTimesBoard = new RecordTimesBoard([], []);
    let gameFormDesc: GameFormDescription;

    beforeEach(() => {
        gameFormDesc = new GameFormDescription(gameName, gameImage, recordTimesBoard);
    });

    it('should create an instance', () => {
        expect(gameFormDesc).toBeTruthy();
    });

    it('instance should have correct values instantiated', () => {
        expect(gameFormDesc.gameName).toEqual(gameName);
        expect(gameFormDesc.gameImage).toEqual(gameImage);
        expect(gameFormDesc.recordTimesBoard).toEqual(recordTimesBoard);
    });
});
