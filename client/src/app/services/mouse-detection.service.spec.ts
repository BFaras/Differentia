import { TestBed } from '@angular/core/testing';
import { Position } from '@common/position';
import { DrawService } from './draw.service';

import { MouseDetectionService } from './mouse-detection.service';
import { SocketClientService } from './socket-client.service';

describe('MouseDetectionService', () => {
    let service: MouseDetectionService;
    let socketSpy: jasmine.SpyObj<SocketClientService>;
    let drawServiceSpy: jasmine.SpyObj<DrawService>;
    let message = 'hello world';
    let context: CanvasRenderingContext2D;

    let position: Position = { x: 0, y: 0 };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SocketClientService, useValue: socketSpy },
                { provide: DrawService, useValue: drawServiceSpy },
            ],
        });
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['drawWord']);
        socketSpy = jasmine.createSpyObj('SocketClientService', ['send']);
        socketSpy.send('Verify position', position);
        drawServiceSpy.drawWord(message, position, context);
        service = TestBed.inject(MouseDetectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('should call ', () => {
    //     service.clickMessage(true);
    //     expect(drawServiceSpy).toHaveBeenCalled();
    // });
});
