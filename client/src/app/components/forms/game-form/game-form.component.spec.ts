import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { PopDialogWarningComponent } from '@app/components/pop-dialogs/pop-dialog-warning/pop-dialog-warning.component';
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
    let dialogRef: jasmine.SpyObj<MatDialogRef<PopDialogWarningComponent, any>>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeAll(async () => {
        jasmine.createSpyObj('GameFormComponent', ['joinFLag', 'createFlag', 'configureGameFormSocketFeatures']);
        dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);

        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameFormComponent],
            imports: [MatFormFieldModule, MatInputModule, MatDialogModule],
            providers: [
                { provide: MatDialogRef, useValue: dialogRef },
                { provide: MatDialog, useValue: dialog },
                { provide: SocketClientService, useValue: socketClientServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameFormComponent);
        gameFormComp = fixture.componentInstance;
        gameFormComp.gameForm = new GameFormDescription(gameName, gameImage, recordTimesBoard);
        TestBed.inject(SocketClientService);

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
        const warningSpy = spyOn(gameFormComp, <any>'openWarningDialog');
        gameFormComp.deleteGameForm(gameFormComp.gameForm.gameName);
        expect(warningSpy).toHaveBeenCalledWith('supprimer le jeu');
        const emitSpy = spyOn(gameFormComp['newItemEvent'], 'emit');

        socketTestHelper.peerSideEmit('Delete or reset applied on gameForm');
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should not emit the name of the game to delete', () => {
        const warningSpy = spyOn(gameFormComp, <any>'openWarningDialog');
        const emitSpy = spyOn(gameFormComp['newItemEvent'], 'emit');
        gameFormComp.deleteGameForm(gameFormComp.gameForm.gameName);

        expect(warningSpy).toHaveBeenCalled();
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should open dialog to get the players username ', () => {
        gameFormComp.openDialog(true);
        expect(dialog['open']).toHaveBeenCalled();
    });

    it('should open dialog to warn User ', () => {
        gameFormComp['openWarningDialog']('supprimer le jeu');
        expect(dialog['open']).toHaveBeenCalled();
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
        const response = true;
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

    it('should reset times board', () => {
        const warningSpy = spyOn(gameFormComp, <any>'openWarningDialog');
        gameFormComp.resetTimesBoard(gameFormComp.gameForm.gameName);
        expect(warningSpy).toHaveBeenCalledWith('réinitialiser le temps du jeu');
        const socketSpy = spyOn(socketClientServiceMock, 'send');
        socketTestHelper.peerSideEmit('Delete or reset applied on gameForm');

        expect(socketSpy).toHaveBeenCalled();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });
});
