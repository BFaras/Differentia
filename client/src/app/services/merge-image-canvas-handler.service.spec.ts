import { TestBed } from '@angular/core/testing';

import { MergeImageCanvasHandlerService } from './merge-image-canvas-handler.service';

describe('MergeImageCanvasHandlerService', () => {
  let service: MergeImageCanvasHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MergeImageCanvasHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
