import { TestBed } from '@angular/core/testing';
import { Position } from '@common/position';
import { DifferenceDetectionService } from './difference-detection.service';
import { DrawService } from './draw.service';
import { SocketClientService } from './socket-client.service';

describe('MouseDetectionService', () => {
    let service: DifferenceDetectionService;
    let socketSpy: jasmine.SpyObj<SocketClientService>;
    let drawServiceSpy: jasmine.SpyObj<DrawService>;
    let mouseEvent: MouseEvent;
    let position: Position = { x: 10, y: 20 };

    beforeAll(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['drawWord']);
        socketSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'send']);
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SocketClientService, useValue: socketSpy },
                { provide: DrawService, useValue: drawServiceSpy },
            ],
        });

        drawServiceSpy.context1 = {} as CanvasRenderingContext2D;
        drawServiceSpy.context2 = {} as CanvasRenderingContext2D;
        drawServiceSpy.context3 = {} as CanvasRenderingContext2D;
        drawServiceSpy.context4 = {} as CanvasRenderingContext2D;

        socketSpy.connect();
        drawServiceSpy.drawWord('hello', position, drawServiceSpy.context1);
        service = TestBed.inject(DifferenceDetectionService);
        service['mousePosition'] = position;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call mouseHitDetect', () => {
        mouseEvent = {
            offsetX: position.x,
            offsetY: position.y,
            button: 0,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service['mousePosition']).toEqual(position);
    });

    it('should call correct sound', () => {
        const playSoundSpy = spyOn(service, 'playSound').and.callThrough();
        service.playSound(true, true);
        expect(playSoundSpy).toHaveBeenCalled();
    });

    it('should call incorrect sound', () => {
        const playSoundSpy = spyOn(service, 'playSound').and.callThrough();
        service.playSound(false, true);
        expect(playSoundSpy).toHaveBeenCalled();
    });

    it('should call clickMessage with good position', () => {
        service.clickMessage(true, true);
        expect(service['message']).toEqual('GOOD JOB');
    });

    it('should call clickMessage with wrong position', () => {
        service.clickMessage(false, true);
        expect(service['message']).toEqual('ERROR');
    });

    it('should verify if game in multiplayer is finished'),
        () => {
            const multiplayer = true;
            const gameVerifiedSpy = spyOn(service, 'verifyGameFinished').and.callThrough();
            service.verifyGameFinished(true, multiplayer, false);
            expect(gameVerifiedSpy).toHaveBeenCalled();
        };

    it('should verify if game in solo is finished'),
        () => {
            const multiplayer = false;
            const gameVerifiedSpy = spyOn(service, 'verifyGameFinished').and.callThrough();
            service.verifyGameFinished(false, multiplayer, true);
            expect(gameVerifiedSpy).toHaveBeenCalled();
        };
});
