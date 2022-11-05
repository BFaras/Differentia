import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IMAGE_HEIGHT, IMAGE_WIDTH } from '@common/const';
import { CanvasDataHandlerService } from './canvas-data-handler.service';
import { DrawingHistoryService } from './drawing-history.service';

fdescribe('CanvasDataHandlerService', () => {
  let service: CanvasDataHandlerService;
  let drawingHistoryServiceSpy:jasmine.SpyObj<DrawingHistoryService>
  let mainCanvas: HTMLCanvasElement;
  let mockIndexLeftCanvas: number;
  let mockIndexRightCanvas: number;
  let contextMock:CanvasRenderingContext2D;

  beforeAll(()=>{
    mainCanvas = CanvasTestHelper.createCanvas(IMAGE_HEIGHT, IMAGE_WIDTH);
    contextMock = mainCanvas.getContext("2d")!;
    mockIndexLeftCanvas = 0;
    mockIndexRightCanvas = 1;
    drawingHistoryServiceSpy = jasmine.createSpyObj('DrawingHandlerService',['saveCanvas']);
    
  })
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DrawingHistoryService, useValue:drawingHistoryServiceSpy},]
    });
    service = TestBed.inject(CanvasDataHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should test set context if add context to list of context', () => {
    service.setContext(contextMock,mockIndexLeftCanvas);
    expect(service.contextList.length).not.toEqual(0);
  });

  it('should test if possible clear canvas', () => {
    service.setContext(contextMock,mockIndexLeftCanvas);
    service.setContext(contextMock,mockIndexRightCanvas);
    const spySaveCanvas = drawingHistoryServiceSpy.saveCanvas.and.returnValue()
    service.clearCanvas(mockIndexRightCanvas)
    expect(spySaveCanvas).toHaveBeenCalled();
  });

  it('should verify if copy other canvas for index 0 ', () => {
    service.setContext(contextMock,mockIndexLeftCanvas);
    service.setContext(contextMock,mockIndexRightCanvas);
    const drawOnCanvasMock = spyOn(service,'drawOnCanvas');
    const obtainTheRightCanvasMock = spyOn(service,'obtainTheRightCanvas');
    service.copyCanvas(mockIndexLeftCanvas);
    expect(drawOnCanvasMock).toHaveBeenCalled();
    expect(obtainTheRightCanvasMock).toHaveBeenCalled();
  });

  it('should verify if copy other canvas for index 1 ', () => {
    service.setContext(contextMock,mockIndexLeftCanvas);
    service.setContext(contextMock,mockIndexRightCanvas);
    const drawOnCanvasMock = spyOn(service,'drawOnCanvas');
    const obtainTheRightCanvasMock = spyOn(service,'obtainTheRightCanvas');
    service.copyCanvas(mockIndexRightCanvas);
    expect(drawOnCanvasMock).toHaveBeenCalled();
    expect(obtainTheRightCanvasMock).toHaveBeenCalled();
  });

  it('should verify if possible share with other canvas for index 0 ', () => {
    service.setContext(contextMock,mockIndexLeftCanvas);
    service.setContext(contextMock,mockIndexRightCanvas);
    const copyCanvasMock = spyOn(service,'copyCanvas');
    service.shareDataWithOtherCanvas(mockIndexLeftCanvas);
    expect(copyCanvasMock).toHaveBeenCalled()
  });

  it('should verify if possible share with other canvas for index 1 ', () => {
    service.setContext(contextMock,mockIndexLeftCanvas);
    service.setContext(contextMock,mockIndexRightCanvas);
    const copyCanvasMock = spyOn(service,'copyCanvas');
    service.shareDataWithOtherCanvas(mockIndexRightCanvas);
    expect(copyCanvasMock).toHaveBeenCalled()
  });

  
});
