import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { DifferenceDetectionService } from '@app/services/difference-detection.service';
import { DrawService } from '@app/services/draw.service';
import { ImageGeneratorService } from '@app/services/image-generator.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { SocketClientService } from '@app/services/socket-client.service';
import {
    CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE,
    CLASSIC_MULTIPLAYER_LOST_MESSAGE,
    CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE,
    DEFAULT_USERNAME,
    IMAGE_HEIGHT,
    IMAGE_WIDTH,
} from '@common/const';
import { EndGameInformations } from '@common/end-game-informations';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { Socket } from 'socket.io-client';
import { PlayAreaComponent } from './play-area.component';
import SpyObj = jasmine.SpyObj;
export class SocketClientServiceMock extends SocketClientService {
    override connect() {}
}
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let socketClientServiceMock: SocketClientServiceMock;
    let differenceServiceSpy: SpyObj<DifferenceDetectionService>;
    let drawServiceSpy: SpyObj<DrawService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let imageGeneratorSpy: SpyObj<ImageGeneratorService>;
    let imageDifferenceSpy: SpyObj<ImageToImageDifferenceService>;
    let mouseEvent: MouseEvent;
    let position: Position = { x: 10, y: 20 };
    let socketTestHelper: SocketTestHelper;
    let endGameInfos: EndGameInformations;
    const differencesFoundInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: [],
        isValidDifference: true,
        socketId: 'socket1',
        playerUsername: DEFAULT_USERNAME,
    };
    let firstImage: HTMLImageElement = new Image(IMAGE_HEIGHT, IMAGE_WIDTH);
    let secondImage: HTMLImageElement = new Image(IMAGE_HEIGHT, IMAGE_WIDTH);
    let differenceImage: HTMLImageElement[] = [firstImage, secondImage];

    beforeAll(async () => {
        socketTestHelper = new SocketTestHelper();
        socketClientServiceMock = new SocketClientServiceMock();
        socketClientServiceMock.socket = socketTestHelper as unknown as Socket;

        differenceServiceSpy = jasmine.createSpyObj('MouseDetectionService', ['mouseHitDetect', 'clickMessage', 'verifyGameFinished', 'playSound']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['context1', 'context2', 'context3', 'context4', 'context5', 'drawWord']);
        imageGeneratorSpy = jasmine.createSpyObj('ImageGeneratorService', ['copyCertainPixelsFromOneImageToACanvas']);
        imageDifferenceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', ['waitForImageToLoad']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: SocketClientService, useValue: socketClientServiceMock },
                { provide: DrawService, useValue: drawServiceSpy },
                { provide: DifferenceDetectionService, useValue: differenceServiceSpy },
                { provide: ImageToImageDifferenceService, useValue: imageDifferenceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: ImageGeneratorService, useValue: imageGeneratorSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlayAreaComponent);
        jasmine.clock().install();
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.differentImages = differenceImage;
        TestBed.inject(SocketClientService);

        spyOn(CanvasRenderingContext2D.prototype, 'putImageData').and.callFake(() => {});
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call display images in ngOnInt', async () => {
        const spy = spyOn(component, <any>'displayImages');
        await component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should set the canvas when displaying images ', () => {
        const originalSpy = spyOn(component.originalCanvas.nativeElement, 'focus');
        const clickCanvas1Spy = spyOn(component.clickCanvas1.nativeElement, 'focus');
        const clickCanvas2Spy = spyOn(component.clickCanvas2.nativeElement, 'focus');
        const modifiedCanvasSpy = spyOn(component.modifiedCanvas.nativeElement, 'focus');

        component['displayImages']();
        expect(originalSpy).toHaveBeenCalled();
        expect(modifiedCanvasSpy).toHaveBeenCalled();
        expect(clickCanvas1Spy).toHaveBeenCalled();
        expect(clickCanvas2Spy).toHaveBeenCalled();
    });

    it('should open dialog', () => {
        component['openEndGameDialog']('Hello');
        expect(matDialogSpy).toBeTruthy();
    });

    it('should detect mouseEvent', () => {
        mouseEvent = {
            offsetX: position.x,
            offsetY: position.y,
            button: 0,
        } as MouseEvent;
        component.detectDifference(mouseEvent);
        expect(differenceServiceSpy['mouseHitDetect']).toHaveBeenCalled();
    });

    it('should open end game Dialog ', () => {
        endGameInfos = {
            isMultiplayer: false,
            isAbandon: false,
            isGameWon: true,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalled();
    });

    it('should call clickMessage, playSound and verifyGameFinished when there is an event valid click', () => {
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        component['configurePlayAreaSocket']();

        expect(differenceServiceSpy['clickMessage']).toHaveBeenCalled();
        expect(differenceServiceSpy['playSound']).toHaveBeenCalled();
        expect(differenceServiceSpy['verifyGameFinished']).toHaveBeenCalled();
    });

    it('should set the context 5 to blink then to paused', () => {
        differencesFoundInfo.isValidDifference = true;
        differencesFoundInfo.differencePixelsNumbers = [];
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        component['configurePlayAreaSocket']();
        expect(drawServiceSpy['context5'].canvas.id).toEqual('blink');
        jasmine.clock().tick(3000);
        expect(drawServiceSpy['context5'].canvas.id).toEqual('paused');
    });

    it('should call end game event when the user win', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: false,
            isGameWon: true,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_REAL_WIN_MESSAGE);
    });

    it('should call end game event when the user abandon', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: true,
            isGameWon: false,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_ABANDON_WIN_MESSAGE);
    });

    it('should call end game event when the user lose', () => {
        endGameInfos = {
            isMultiplayer: true,
            isAbandon: false,
            isGameWon: false,
        };
        const spy = spyOn(component, <any>'openEndGameDialog');
        socketTestHelper.peerSideEmit('End game', endGameInfos);
        component['configurePlayAreaSocket']();

        expect(spy).toHaveBeenCalledWith(CLASSIC_MULTIPLAYER_LOST_MESSAGE);
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });
});
