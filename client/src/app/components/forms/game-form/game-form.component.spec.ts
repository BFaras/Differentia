import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { SocketClientService } from '@app/services/socket-client.service';
import { Socket } from 'socket.io-client';
import { GameFormDescription } from '../../../classes/game-form-description';
import { RecordTimesBoard } from '../../../classes/record-times-board';
import { GameFormComponent } from './game-form.component';

export class SocketClientServiceMock extends SocketClientService {}

describe('GameFormComponent', () => {
    const gameName = 'name';
    const gameImage = 'image';
    const recordTimesBoard = new RecordTimesBoard([], []);
    let gameFormComp: GameFormComponent;
    let socketClientServiceMock: SocketClientServiceMock;
    let socketTestHelper: SocketTestHelper;
    let fixture: ComponentFixture<GameFormComponent>;

    beforeAll(async () => {
        jasmine.createSpyObj('GameFormComponent', ['joinFLag', 'createFlag', 'configureGameFormSocketFeatures']);

        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameFormComponent],
            imports: [MatFormFieldModule, MatInputModule, MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: SocketClientService, useValue: socketClientServiceMock },
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

    it('should open dialog to get the players username ', () => {
        const dialogSpy = spyOn(gameFormComp['dialog'], 'open');
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

    it('should call config in ngOnit', () => {
        spyOn(gameFormComp, <any>'configureGameFormSocketFeatures');
        gameFormComp.gameForm.gameName = 'Lucky';
        gameFormComp.ngOnInit();
        expect(gameFormComp['configureGameFormSocketFeatures']).toHaveBeenCalled();
    });

    it('should set attribute isPlayerWaiting to true if someone is waiting', () => {
        let response = true;
        gameFormComp.gameForm.gameName = 'Lucky';
        socketClientServiceMock.connect();

        socketTestHelper.peerSideEmit(`${gameFormComp.gameForm.gameName} nobody is waiting no more`);
        gameFormComp['configureGameFormSocketFeatures']();
        expect(gameFormComp.isPlayerWaiting).toBeFalse();

        socketTestHelper.peerSideEmit(`${gameFormComp.gameForm.gameName} let me tell you if someone is waiting`, response);
        gameFormComp['configureGameFormSocketFeatures']();
        expect(gameFormComp.isPlayerWaiting).toEqual(true);
    });

    it('should set attribute isPlayerWaiting to false if nobody is waiting', () => {
        gameFormComp.gameForm.gameName = 'Lucky';
        socketClientServiceMock.connect();

        socketTestHelper.peerSideEmit(`${gameFormComp.gameForm.gameName} nobody is waiting no more`);
        gameFormComp['configureGameFormSocketFeatures']();
        expect(gameFormComp.isPlayerWaiting).toBeFalse();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
