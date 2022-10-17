import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ImageGeneratorService } from '@app/services/difference-detector-feature/image-generator.service';
import { DrawService } from '@app/services/draw.service';
import { ImageToImageDifferenceService } from '@app/services/image-to-image-difference.service';
import { MouseDetectionService } from '@app/services/mouse-detection.service';
import { SocketClientService } from '@app/services/socket-client.service';
import { PlayAreaComponent } from './play-area.component';
import SpyObj = jasmine.SpyObj;
describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let socketServiceSpy: SpyObj<SocketClientService>;
    let mouseServiceSpy: SpyObj<MouseDetectionService>;

    beforeAll(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketClientService', ['connect', 'on', 'send']);
        mouseServiceSpy = jasmine.createSpyObj('MouseDetectionService', ['incrementNbrDifference']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: SocketClientService, useValue: socketServiceSpy },
                { provide: DrawService, useValue: [] },
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

    it('should call display ', async () => {
        await component.ngOnInit();
        expect(component.displayImages()).toBeTruthy();
    });
});
