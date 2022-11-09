import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Coordinate } from '@app/interfaces/coordinate';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { DrawingHandlerService } from './drawing-handler.service';
import { DrawingHistoryService } from './drawing-history.service';
import { PencilService } from './pencil.service';
describe('DrawingHandlerService', () => {
  let canvasMock: HTMLCanvasElement;
  let contextMock: CanvasRenderingContext2D;
  let service: DrawingHandlerService;
  let drawingHistoryServiceSpy:jasmine.SpyObj<DrawingHistoryService>
  let pencilServiceSpy:jasmine.SpyObj<PencilService>
  let canvasDomReactMock: DOMRect

  beforeAll(()=>{
    canvasMock = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
    contextMock = canvasMock.getContext("2d")!;
    canvasDomReactMock = canvasMock.getBoundingClientRect()
    drawingHistoryServiceSpy = jasmine.createSpyObj('DrawingHandlerService',['saveCanvas','getRedoDrawingHistory']);
    pencilServiceSpy = jasmine.createSpyObj('PencilService',['obtainPencilWidth','getStateOfPencil','assignRightLineCap','obtainPencilColor'])  
  })

  beforeEach(() => {
    TestBed.configureTestingModule({providers:[
      { provide:DrawingHistoryService, useValue:drawingHistoryServiceSpy},
      { provide:PencilService, useValue:pencilServiceSpy}
    ]});
    service = TestBed.inject(DrawingHandlerService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify if can get state pencil, color of pencil , width and the assign line cap', () => {
    service.setContext(contextMock);
    const mockIndex = 2;
    service.setPencilInformation(mockIndex);
    expect(pencilServiceSpy.obtainPencilColor).toHaveBeenCalled();
    expect(pencilServiceSpy.obtainPencilWidth).toHaveBeenCalled();
    expect(pencilServiceSpy.assignRightLineCap).toHaveBeenCalled();
    expect(pencilServiceSpy.getStateOfPencil).toHaveBeenCalled();

  });

  it('should get coordiante X', () => {
    const mockEvent = new MouseEvent('mouseup', {clientX: 50, clientY: 150});
    Object.defineProperty(canvasDomReactMock,'left',{value:12});
    const expecedValue = 38;
    expect(service.getCoordinateX(mockEvent,canvasDomReactMock)).toEqual(expecedValue);

  });

  it('should get coordiante Y', () => {
    const mockEvent = new MouseEvent('mouseup', {clientX: 50, clientY: 150});
    Object.defineProperty(canvasDomReactMock,'left',{value:12});
    const expecedValue = 150;
    expect(service.getCoordinateY(mockEvent,canvasDomReactMock)).toEqual(expecedValue);

  });

  it('should setAllObservable ', () => {
  
    service.setContext(contextMock);
    service.setAllObservables();
    const mockIndex = 2;
    service.saveOnMouseUp(mockIndex);
    expect(drawingHistoryServiceSpy.saveCanvas).toHaveBeenCalled()
    
  });

  it('should test drawOnCanvas ', () => {
    service.setContext(contextMock);
    const prevCoordinateMock:Coordinate = {
      x: 10,
      y:20
    }

    const currentCoordinateMock:Coordinate = {
      x:30,
      y:40
    }
    const spy = spyOn(service['context'],'beginPath')
    service.drawOnCanvas(prevCoordinateMock,currentCoordinateMock);
    expect(spy).toHaveBeenCalled();
    
    
  });

  it('should test observation of mouse ', () => {
    service.setContext(contextMock);
    service.setAllObservables();
    const spy = spyOn(service,'stopObservingMousePath')
    service.startObservingMousePath()
    service.stopObservingMousePath()
    expect(spy).toHaveBeenCalled()

    
    
  });

  it('should verify save on mouse down process ', () => {
    const mockIndex:number = 0;
    const mockImageData:ImageData[][] = [[contextMock.getImageData(0,0,640,480)],[contextMock.getImageData(0,0,640,480)]];
    
    drawingHistoryServiceSpy.saveCanvas.and.returnValue();
    drawingHistoryServiceSpy.getRedoDrawingHistory.and.returnValue(mockImageData);
    service.savingProcess(mockIndex);
    expect(drawingHistoryServiceSpy.getRedoDrawingHistory).toHaveBeenCalled();

  });

});
