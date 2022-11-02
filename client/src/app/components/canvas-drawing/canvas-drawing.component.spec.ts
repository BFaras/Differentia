import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingHandlerService } from '@app/services/drawing-handler.service';
import { Subject } from 'rxjs';
import { CanvasDrawingComponent } from './canvas-drawing.component';
fdescribe('CanvasDrawingComponent', () => {
  let component: CanvasDrawingComponent;
  let fixture: ComponentFixture<CanvasDrawingComponent>;
  let drawingHandlerServiceSpy:jasmine.SpyObj<DrawingHandlerService>
  let mockEmitterStartObservingMousePath: Subject<[MouseEvent,MouseEvent]>


  beforeEach(async () => {
    mockEmitterStartObservingMousePath = new Subject();
    drawingHandlerServiceSpy = jasmine.createSpyObj('DrawingHandlerService',[
    'startObservingMousePath','setCanvas','setAllObservables','getCoordinateX','getCoordinateY','drawOnCanvas'])
    drawingHandlerServiceSpy.startObservingMousePath.and.returnValue(mockEmitterStartObservingMousePath.asObservable());
    drawingHandlerServiceSpy.setAllObservables.and.returnValue()
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
