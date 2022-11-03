import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { Subject } from 'rxjs';
import { CanvasDrawingComponent } from './canvas-drawing.component';
describe('CanvasDrawingComponent', () => {
  let component: CanvasDrawingComponent;
  let fixture: ComponentFixture<CanvasDrawingComponent>;
  let canvasDataHandlerServiceSpy:jasmine.SpyObj<CanvasDataHandlerService>
  let keyEventHandlerServiceSpy:jasmine.SpyObj<KeyEventHandlerService>
  let drawingHandlerServiceSpy:jasmine.SpyObj<DrawingHandlerService>
  let mergeImageCanvasServiceSpy:jasmine.SpyObj<MergeImageCanvasHandlerService>
  let mockEmitterStartObservingMousePath: Subject<[MouseEvent,MouseEvent]>;

  beforeEach(async () => {
    mockEmitterStartObservingMousePath = new Subject();

    drawingHandlerServiceSpy = jasmine.createSpyObj('DrawingHandlerService',['saveOnMouseDown','saveOnMouseUp',
    'startObservingMousePath','setContext','setAllObservables','getCoordinateX','getCoordinateY','drawOnCanvas','setPencilInformation'])
    drawingHandlerServiceSpy.startObservingMousePath.and.returnValue(mockEmitterStartObservingMousePath);
    drawingHandlerServiceSpy.setAllObservables.and.returnValue();

    canvasDataHandlerServiceSpy= jasmine.createSpyObj('CanvasDataHandlerService',['setContext'])

    keyEventHandlerServiceSpy = jasmine.createSpyObj('KeyEventHandlerService',['setIndexImageOnDrawing'])

    mergeImageCanvasServiceSpy = jasmine.createSpyObj('MergeImageCanvasHandlerService',['setRightContextAndCanvas','setLeftContextAndCanvas'])

    
    await TestBed.configureTestingModule({
      declarations: [ CanvasDrawingComponent ],
      providers:[
        { provide:DrawingHandlerService, useValue:drawingHandlerServiceSpy},
        { provide:CanvasDataHandlerService, useValue:canvasDataHandlerServiceSpy},
        { provide:KeyEventHandlerService, useValue:keyEventHandlerServiceSpy},
        { provide:MergeImageCanvasHandlerService, useValue:mergeImageCanvasServiceSpy},
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prepare canvas for drawing and prepare merging', () => {
    const useFocusSpy = spyOn(component, 'useCanvasFocusedOn');
    const prepareCanvasDrawingSpy = spyOn(component, 'prepareCanvasDrawing');
    const prepareCanvasMergingSpy = spyOn(component,'prepareCanvasMerging');
    const addContextCanvasData = spyOn(component,'addContextToCanvasData');
    component.ngAfterViewInit()
    expect(useFocusSpy).toHaveBeenCalled();
    expect(prepareCanvasDrawingSpy).toHaveBeenCalled();
    expect(prepareCanvasMergingSpy).toHaveBeenCalled();
    expect(addContextCanvasData).toHaveBeenCalled();

  });

  it('should save shortCut ', () => {
    component.saveCanvasForShortcut();
    keyEventHandlerServiceSpy.setIndexImageOnDrawing.and.returnValue();
    expect(keyEventHandlerServiceSpy.setIndexImageOnDrawing).toHaveBeenCalled()

  });

  it('should verify allowToDrawOnCanvas', () => {
    
    const setCanvasFocusedOnSpy = spyOn(component,'useCanvasFocusedOn');
    component.allowToDrawOnCanvas()
    expect(setCanvasFocusedOnSpy).toHaveBeenCalled();

  });
  
  it('should verify saveOnDrawing', () => {
    component.saveOnDrawing()
    expect(drawingHandlerServiceSpy.saveOnMouseDown).toHaveBeenCalled();
    expect(drawingHandlerServiceSpy.saveOnMouseUp).toHaveBeenCalled();

  });

  it('should prepare canvas left', () => {
    component.indexOfCanvas = 0
    component.prepareCanvasMerging()

    expect(mergeImageCanvasServiceSpy.setLeftContextAndCanvas).toHaveBeenCalled();
    

  });

  it('should prepare canvas Right', () => {
    component.indexOfCanvas = 1
    component.prepareCanvasMerging()

    expect(mergeImageCanvasServiceSpy.setRightContextAndCanvas).toHaveBeenCalled();
    

  });

  it('should verify merging Canvas', () => {
    component.indexOfCanvas = 0
    component.prepareCanvasMerging()

    expect(mergeImageCanvasServiceSpy.setLeftContextAndCanvas).toHaveBeenCalled();
    

  });


  it('should test functions of drawHandler were called when drawing ', () => {

    const mockEventUp = new MouseEvent('mouseup', {clientX: 50, clientY: 150});
    const mockEventDown = new MouseEvent('mousedown',{clientX: 200, clientY: 250});
    drawingHandlerServiceSpy.getCoordinateY.and.returnValue(1)
    drawingHandlerServiceSpy.getCoordinateX.and.returnValue(2)
    drawingHandlerServiceSpy.setContext.and.returnValue();
    drawingHandlerServiceSpy.drawOnCanvas.and.returnValue();
''
    component.prepareCanvasDrawing();
    mockEmitterStartObservingMousePath.next([mockEventDown,mockEventUp]);
    
    expect(drawingHandlerServiceSpy.getCoordinateY).toHaveBeenCalled()
    expect(drawingHandlerServiceSpy.getCoordinateX).toHaveBeenCalled()
    expect(drawingHandlerServiceSpy.setContext).toHaveBeenCalled()
    expect(drawingHandlerServiceSpy.drawOnCanvas).toHaveBeenCalled()
    

  });
});
