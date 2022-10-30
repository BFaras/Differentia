import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { ImageGeneratorService } from '@app/services/difference-detector-feature/image-generator.service';
import { DrawService } from '@app/services/draw.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { DEFAULT_USERNAME } from '@common/const';
import { GameplayDifferenceInformations } from '@common/gameplay-difference-informations';
import { Position } from '@common/position';
import { Socket } from 'socket.io-client';
import { PlayAreaComponent } from './play-area.component';
import SpyObj = jasmine.SpyObj;
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let socketServiceSpy: SpyObj<SocketClientService>;
    let mouseServiceSpy: SpyObj<MouseDetectionService>;
    let drawServiceSpy: SpyObj<DrawService>;
    let matDialogSpy: SpyObj<MatDialog>;
    let imageGeneratorSpy: SpyObj<ImageGeneratorService>;
    let imageDifferenceSpy: SpyObj<ImageToImageDifferenceService>;
    let mouseEvent: MouseEvent;
    let position: Position = { x: 10, y: 20 };
    let differenceImage: HTMLImageElement[] = [new Image(640, 480)];
    let socketTestHelper: SocketTestHelper;
    const differencesFoundInfo: GameplayDifferenceInformations = {
        differencePixelsNumbers: [],
        isValidDifference: true,
        playerName: DEFAULT_USERNAME,
    };

    beforeAll(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);
        mouseServiceSpy = jasmine.createSpyObj('MouseDetectionService', ['mouseHitDetect', 'clickMessage']);
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['context1', 'context2', 'context3', 'context4', 'context5', 'drawWord']);
        imageGeneratorSpy = jasmine.createSpyObj('ImageGeneratorService', ['copyCertainPixelsFromOneImageToACanvas']);
        imageDifferenceSpy = jasmine.createSpyObj('ImageToImageDifferenceService', ['waitForImageToLoad']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: DrawService, useValue: drawServiceSpy },
                { provide: MouseDetectionService, useValue: mouseServiceSpy },
                { provide: ImageToImageDifferenceService, useValue: imageDifferenceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
                { provide: ImageGeneratorService, useValue: imageGeneratorSpy },
            ],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.differentImages = differenceImage;
        const socketService = TestBed.inject(SocketClientService);
        socketTestHelper = new SocketTestHelper();

        socketService.socket = socketTestHelper as unknown as Socket;

        //Dans le tests
        //socketTestHelper.peerSideEmit('Valid click');
    });

    it('should display images ', () => {
        component.displayImages();
        fixture.detectChanges();
        expect(drawServiceSpy).toHaveBeenCalled();
        expect(drawServiceSpy['context1'].drawImage).toHaveBeenCalled();
        expect(spyOn(drawServiceSpy['context1'], 'drawImage')).toBeTruthy();
    });

    it('should open dialog', () => {
        component.openDialog();
        expect(matDialogSpy).toBeTruthy();
    });

    it('should detect mouseEvent  ', () => {
        mouseEvent = {
            offsetX: position.x,
            offsetY: position.y,
            button: 0,
        } as MouseEvent;
        component.detectDifference(mouseEvent);
        expect(mouseServiceSpy['mouseHitDetect']).toHaveBeenCalled();
    });

    it('should configure socket', () => {
        component.configurePlayAreaSocket();
        socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
        socketServiceSpy.connect();
        expect(component.pixelList).toEqual(differencesFoundInfo.differencePixelsNumbers);
        expect(socketServiceSpy['on']).toHaveBeenCalled();
        socketTestHelper.peerSideEmit('End game', () => {});
    });

    // it('should configure socket', () => {
    //     component.configurePlayAreaSocket();
    //     socketTestHelper.peerSideEmit('Valid click', differencesFoundInfo);
    //     expect(component.pixelList).toEqual(differencesFoundInfo.differencePixelsNumbers);
    // });
});
