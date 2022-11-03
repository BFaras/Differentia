import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasDataHandlerService } from '@app/services/canvas-data-handler.service';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { DrawingHistoryService } from '@app/services/drawing-history.service';
import { KeyEventHandlerService } from '@app/services/key-event-handler.service';
import { MergeImageCanvasHandlerService } from '@app/services/merge-image-canvas-handler.service';
import { PencilService } from '@app/services/pencil.service';
import { Subject } from 'rxjs';
import { CanvasDrawingComponent } from './canvas-drawing.component';
fdescribe('CanvasDrawingComponent', () => {
  let component: CanvasDrawingComponent;
  let fixture: ComponentFixture<CanvasDrawingComponent>;
  let canvasDataHandlerService:jasmine.SpyObj<CanvasDataHandlerService>
  let keyEventHandlerService:jasmine.SpyObj<KeyEventHandlerService>
  let drawingHandlerServiceSpy:jasmine.SpyObj<DrawingHandlerService>
  let drawingHistoryServiceSpy:jasmine.SpyObj<DrawingHistoryService>
  let pencilServiceSpy:jasmine.SpyObj<PencilService>
  let mergeImageCanvasServiceSpy:jasmine.SpyObj<MergeImageCanvasHandlerService>
  let mockEmitterStartObservingMousePath: Subject<[MouseEvent,MouseEvent]>;
  let mockEmitterMouseDown: Subject<MouseEvent>
  let mockEmitterMouseUp: Subject<MouseEvent>


  beforeEach(async () => {
    mockEmitterStartObservingMousePath = new Subject();
    mockEmitterMouseDown = new Subject();
    mockEmitterMouseUp = new Subject();
    drawingHandlerServiceSpy = jasmine.createSpyObj('DrawingHandlerService',[
    'startObservingMousePath','getMouseDownObservable','getMouseUpObservable','setCanvas','setAllObservables','getCoordinateX','getCoordinateY','drawOnCanvas'])
    drawingHandlerServiceSpy.startObservingMousePath.and.returnValue(mockEmitterStartObservingMousePath);
    drawingHandlerServiceSpy.getMouseDownObservable.and.returnValue(mockEmitterMouseDown);
    drawingHandlerServiceSpy.getMouseUpObservable.and.returnValue(mockEmitterMouseUp);
    drawingHandlerServiceSpy.setAllObservables.and.returnValue();
    

    await TestBed.configureTestingModule({
      declarations: [ CanvasDrawingComponent ],
      providers:[{
        provide:DrawingHandlerService, useValue:drawingHandlerServiceSpy
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should useThisCanvas should initilize canvas', () => {

    expect(drawingHandlerServiceSpy.setCanvas).toHaveBeenCalled();
    expect(drawingHandlerServiceSpy.setAllObservables).toHaveBeenCalled();

  });

  it('should test functions of drawHandler were called when drawing ', () => {

    const mockEventUp = new MouseEvent('mouseup', {clientX: 50, clientY: 150});
    const mockEventDown = new MouseEvent('mousedown',{clientX: 200, clientY: 250});

    mockEmitterStartObservingMousePath.next([mockEventDown,mockEventUp]);
    drawingHandlerServiceSpy.getCoordinateY.and.returnValue(1)
    drawingHandlerServiceSpy.getCoordinateX.and.returnValue(2)
    drawingHandlerServiceSpy.setCanvas.and.returnValue();
    drawingHandlerServiceSpy.drawOnCanvas.and.returnValue();

    expect(drawingHandlerServiceSpy.getCoordinateY).toHaveBeenCalled()
    expect(drawingHandlerServiceSpy.getCoordinateX).toHaveBeenCalled()
    expect(drawingHandlerServiceSpy.setCanvas).toHaveBeenCalled()
    expect(drawingHandlerServiceSpy.drawOnCanvas).toHaveBeenCalled()
    

  });
});
