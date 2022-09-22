import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameFormDescription } from '../../../classes/game-form-description';
import { RecordTimesBoard } from '../../../classes/record-times-board';
import { GameFormComponent } from './game-form.component';

describe('GameFormComponent', () => {
    const gameName = 'name';
    const gameImage = 'image';
    const recordTimesBoard = new RecordTimesBoard([], []);

    let gameFormComp: GameFormComponent;
    let fixture: ComponentFixture<GameFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameFormComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameFormComponent);
        gameFormComp = fixture.componentInstance;
        gameFormComp.gameForm = new GameFormDescription(gameName, gameImage, recordTimesBoard);
        fixture.detectChanges();
    });

    it('should create component', () => {
        expect(gameFormComp).toBeTruthy();
    });

    it('GameFormDescription should be the one that was in the Input', () => {
        expect(gameFormComp.gameForm.gameName).toEqual(gameName);
        expect(gameFormComp.gameForm.gameImage).toEqual(gameImage);
        expect(gameFormComp.gameForm.recordTimesBoard).toEqual(recordTimesBoard);
    });
});
