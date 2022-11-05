import { TestBed } from '@angular/core/testing';
import { DrawingHistoryService } from './drawing-history.service';

import { KeyEventHandlerService } from './key-event-handler.service';

describe('KeyEventHandlerService', () => {
  let service: KeyEventHandlerService;
  let drawingHistoryServiceSpy:jasmine.SpyObj<DrawingHistoryService>

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: DrawingHistoryService, useValue:drawingHistoryServiceSpy},]
    });
    service = TestBed.inject(KeyEventHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should verify if setindexImageOnDrawing was called', () => {
    const numberMocked:number = 2;
    service.setIndexImageOnDrawing(numberMocked)
    service.deleteDrawnLineShortCut()
    expect(drawingHistoryServiceSpy.cancelCanvas).toHaveBeenCalled()
  });

  it('should verify if cancelDeletedcanvas was called ', () => {
    const numberMocked:number = 2;
    service.setIndexImageOnDrawing(numberMocked)
    service.cancelDeleteDrawnLineShortCut()
    expect(drawingHistoryServiceSpy.cancelDeletedCanvas).toHaveBeenCalled()
  });
});
