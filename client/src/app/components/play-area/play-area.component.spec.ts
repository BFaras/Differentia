import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ImageGeneratorService } from '@app/services/difference-detector-feature/image-generator.service';
import { DrawService } from '@app/services/draw.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { Position } from '@common/position';
import { PlayAreaComponent } from './play-area.component';
import SpyObj = jasmine.SpyObj;
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let socketServiceSpy: SpyObj<SocketClientService>;
    let mouseServiceSpy: SpyObj<MouseDetectionService>;
    let drawServiceSpy: SpyObj<DrawService>;
    let mouseEvent: MouseEvent;
    let position: Position = { x: 10, y: 20 };

    beforeAll(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);
        mouseServiceSpy = jasmine.createSpyObj('MouseDetectionService', ['mouseHitDetect', 'clickMessage']);
        drawServiceSpy = jasmine.createSpyObj('DrawService', ['context1', 'context2', 'context3', 'drawWord']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: DrawService, useValue: drawServiceSpy },
                { provide: MouseDetectionService, useValue: mouseServiceSpy },
                { provide: ImageToImageDifferenceService, useValue: [] },
                { provide: MatDialog, useValue: [] },
                { provide: ImageGeneratorService, useValue: [] },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should display images ', () => {
        drawServiceSpy.context1 = {} as CanvasRenderingContext2D;
        component.displayImages();
        expect(drawServiceSpy['context1']).toBeUndefined();
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
});
