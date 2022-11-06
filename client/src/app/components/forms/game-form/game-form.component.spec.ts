import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SocketClientService } from '@app/services/socket-client.service';
import { GameFormDescription } from '../../../classes/game-form-description';
import { RecordTimesBoard } from '../../../classes/record-times-board';
import { GameFormComponent } from './game-form.component';

describe('GameFormComponent', () => {
    const gameName = 'name';
    const gameImage = 'image';
    const recordTimesBoard = new RecordTimesBoard([], []);
    let gameFormComp: GameFormComponent;
    let socketSpy: jasmine.SpyObj<SocketClientService>;
    let fixture: ComponentFixture<GameFormComponent>;

    beforeAll(async () => {
        jasmine.createSpyObj('GameFormComponent', ['joinFLag', 'createFlag', 'configureGameFormSocketFeatures']);
        socketSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameFormComponent],
            imports: [MatFormFieldModule, MatInputModule, MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: SocketClientService, useValue: socketSpy },
            ],
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

    it('should emit the name of the game to delete', () => {
        const emitSpy = spyOn(gameFormComp['newItemEvent'], 'emit');
        gameFormComp.deleteGameForm(gameName);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should open dialog', () => {
        const dialogSpy = spyOn(gameFormComp['dialog'], 'open').and.callThrough();
        gameFormComp.openDialog(true);
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('should set join flag', () => {
        gameFormComp.setJoinFlag();
        expect(gameFormComp['createFlag']).toEqual(false);
        expect(gameFormComp['joinFlag']).toEqual(true);
    });

    it('should set create flag', () => {
        gameFormComp.setCreateFlag();
        expect(gameFormComp['createFlag']).toEqual(true);
        expect(gameFormComp['joinFlag']).toEqual(false);
    });

    it('should reset flags', () => {
        gameFormComp.resetFlags();
        expect(gameFormComp['createFlag']).toEqual(false);
        expect(gameFormComp['joinFlag']).toEqual(false);
    });

    it('should configure socket', () => {
        gameFormComp['configureGameFormSocketFeatures'];
        expect(socketSpy['on']).toHaveBeenCalled();
    });

    it('should send socket informations', () => {
        gameFormComp.ngOnInit();
        expect(socketSpy['send']).toHaveBeenCalled();
    });
});
