import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { PencilService } from '@app/services/pencil.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH, VERY_BIG } from '@common/const';
import { ToolSettingComponent } from './tool-setting.component';

describe('ToolSettingComponent', () => {
    let component: ToolSettingComponent;
    let fixture: ComponentFixture<ToolSettingComponent>;
    let canvasDataHandlerServiceSpy: jasmine.SpyObj<CanvasDataHandlerService>;
    let keyEventHandlerServiceSpy: jasmine.SpyObj<KeyEventHandlerService>;
    let drawingHistoryServiceSpy: jasmine.SpyObj<DrawingHistoryService>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let mockDrawingHistory: ImageData[][];
    let mainCanvas: HTMLCanvasElement;

    beforeAll(() => {
        mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
        const firstImageData = mainCanvas.getContext('2d')!.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        mockDrawingHistory = [[firstImageData], []];

        drawingHistoryServiceSpy = jasmine.createSpyObj('DrawingHandlerService', [
            'getCancelDrawingHistory',
            'getRedoDrawingHistory',
            'cancelCanvas',
            'redoCanvas',
        ]);
        drawingHistoryServiceSpy.getCancelDrawingHistory.and.returnValue(mockDrawingHistory);
        drawingHistoryServiceSpy.getRedoDrawingHistory.and.returnValue(mockDrawingHistory);
        canvasDataHandlerServiceSpy = jasmine.createSpyObj('CanvasDataHandlerService', ['clearCanvas', 'copyCanvas', 'shareDataWithOtherCanvas']);
        keyEventHandlerServiceSpy = jasmine.createSpyObj('KeyEventHandlerService', [
            'deleteDrawnLineShortCut',
            'cancelDeleteDrawnLineShortCut',
            'cancelCanvas',
            'cancelDeletedCanvas',
        ]);
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['setWidth', 'setColor', 'setStateOfPencilForRightCanvas', '']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ToolSettingComponent],
            providers: [
                { provide: DrawingHistoryService, useValue: drawingHistoryServiceSpy },
                { provide: CanvasDataHandlerService, useValue: canvasDataHandlerServiceSpy },
                { provide: KeyEventHandlerService, useValue: keyEventHandlerServiceSpy },
                { provide: PencilService, useValue: pencilServiceSpy },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(ToolSettingComponent);
        component = fixture.componentInstance;
        component.indexTool = 1;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should verify if we can catch the keybord keys for left canvas', () => {
        component.handleKeyboardToCancelDeletedDrawnLine();
        component.handleKeyboardToCancelDrawnLine();
        expect(keyEventHandlerServiceSpy.deleteDrawnLineShortCut).toHaveBeenCalled();
        expect(keyEventHandlerServiceSpy.cancelDeleteDrawnLineShortCut).toHaveBeenCalled();
    });

    it('should verify if there are saved lines for index 0 ', () => {
        component.indexTool = 0;
        component.checkIfThereAreSavedDrawnLines();
        component.checkIfThereAreSavedDeletedDrawnLines();
        expect(drawingHistoryServiceSpy.getCancelDrawingHistory).toHaveBeenCalled();
        expect(drawingHistoryServiceSpy.getRedoDrawingHistory).toHaveBeenCalled();
    });

    it('should verify if there are saved lines for index 1', () => {
        component.indexTool = 1;
        component.checkIfThereAreSavedDrawnLines();
        component.checkIfThereAreSavedDeletedDrawnLines();
        expect(drawingHistoryServiceSpy.getCancelDrawingHistory).toHaveBeenCalled();
        expect(drawingHistoryServiceSpy.getRedoDrawingHistory).toHaveBeenCalled();
    });

    it('should verify cancel actions', () => {
        component.cancelActionDrawnLine();
        component.cancelActionDeletedDrawnLine();
        expect(drawingHistoryServiceSpy.cancelCanvas).toHaveBeenCalled();
        expect(drawingHistoryServiceSpy.redoCanvas).toHaveBeenCalled();
    });

    it('should verify changeColor and change width', () => {
        component.color = '#fff';
        component.onChangeWidth(VERY_BIG);
        component.onChangeColor();
        expect(pencilServiceSpy.setColor).toHaveBeenCalled();
        expect(pencilServiceSpy.setWidth).toHaveBeenCalled();
    });

    it('should verify interaction between canvas and tools setting', () => {
        component.clearCanvas();
        component.copyOtherCanvas();
        component.shareDataWithOtherCanvas();

        expect(canvasDataHandlerServiceSpy.copyCanvas).toHaveBeenCalled();
        expect(canvasDataHandlerServiceSpy.shareDataWithOtherCanvas).toHaveBeenCalled();
        expect(canvasDataHandlerServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should verify clickEvent set pencil mode', () => {
        const clickEvent = new Event('click');
        Object.defineProperty(clickEvent, 'currentTarget', { value: 'write' });
        component.setPencilMode(clickEvent);

        expect(pencilServiceSpy.setStateOfPencilForRightCanvas).toHaveBeenCalled();
    });

    it('should verify vereify with other canvas', () => {
        component.shareDataWithOtherCanvas();
        expect(canvasDataHandlerServiceSpy.shareDataWithOtherCanvas).toHaveBeenCalled();
    });
});
