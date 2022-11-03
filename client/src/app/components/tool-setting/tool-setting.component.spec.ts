import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { PencilService } from '@app/services/pencil.service';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { ToolSettingComponent } from './tool-setting.component';

fdescribe('ToolSettingComponent', () => {
  let component: ToolSettingComponent;
  let fixture: ComponentFixture<ToolSettingComponent>;
  let canvasDataHandlerServiceSpy:jasmine.SpyObj<CanvasDataHandlerService>
  let keyEventHandlerServiceSpy:jasmine.SpyObj<KeyEventHandlerService>
  let drawingHistoryServiceSpy:jasmine.SpyObj<DrawingHistoryService>
  let pencilServiceSpy:jasmine.SpyObj<PencilService>
  let mockDrawingHistory:ImageData[][];
  let mainCanvas: HTMLCanvasElement;

  mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
  const firstImageData = mainCanvas.getContext("2d")!.getImageData(0,0,IMAGE_WIDTH,IMAGE_HEIGHT)
  
  beforeAll(()=>{
  mockDrawingHistory = [[firstImageData],[]];
  
  drawingHistoryServiceSpy = jasmine.createSpyObj('DrawingHandlerService',['getCancelDrawingHistory','getUndoCancelDrawingHistory','cancelCanvas','cancelDeletedCanvas']);
  drawingHistoryServiceSpy.getCancelDrawingHistory.and.returnValue(mockDrawingHistory);
  drawingHistoryServiceSpy.getUndoCancelDrawingHistory.and.returnValue(mockDrawingHistory);
  canvasDataHandlerServiceSpy= jasmine.createSpyObj('CanvasDataHandlerService',['clearCanvas','copyOtherCanvas','shareDataWithOtherCanvas']);
  keyEventHandlerServiceSpy = jasmine.createSpyObj('KeyEventHandlerService',['deleteDrawnLineShortCut','cancelDeleteDrawnLineShortCut','cancelCanvas','cancelDeletedCanvas']);
  pencilServiceSpy = jasmine.createSpyObj('PencilService',['setWidth','setColor','setStateOfPencilForRightCanvas',''])  

  })

  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolSettingComponent ],
      providers:[
        { provide:DrawingHistoryService, useValue:drawingHistoryServiceSpy},
        { provide:CanvasDataHandlerService, useValue:canvasDataHandlerServiceSpy},
        { provide:KeyEventHandlerService, useValue:keyEventHandlerServiceSpy},
        { provide:PencilService, useValue:pencilServiceSpy}
      ]
    })
    .compileComponents();
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
    expect(keyEventHandlerServiceSpy.deleteDrawnLineShortCut).toHaveBeenCalled()
    expect(keyEventHandlerServiceSpy.cancelDeleteDrawnLineShortCut).toHaveBeenCalled()
  });

  it('should verify if there are saved lines for index 0 ', () => {
    component.indexTool = 0;
    component.checkIfThereAreSavedDrawnLines();
    component.checkIfThereAreSavedDeletedDrawnLines();
    expect(drawingHistoryServiceSpy.getCancelDrawingHistory).toHaveBeenCalled();
    expect(drawingHistoryServiceSpy.getUndoCancelDrawingHistory).toHaveBeenCalled();
  });

  it('should verify if there are saved lines for index 1', () => {
    component.indexTool = 1;
    component.checkIfThereAreSavedDrawnLines();
    component.checkIfThereAreSavedDeletedDrawnLines();
    expect(drawingHistoryServiceSpy.getCancelDrawingHistory).toHaveBeenCalled();
    expect(drawingHistoryServiceSpy.getUndoCancelDrawingHistory).toHaveBeenCalled();
  });

  it('should verify cancel actions', () => {
    component.cancelActionDrawnLine();
    component.cancelActionDeletedDrawnLine()
    expect(drawingHistoryServiceSpy.cancelCanvas).toHaveBeenCalled();
    expect(drawingHistoryServiceSpy.cancelDeletedCanvas).toHaveBeenCalled()
  });







});
