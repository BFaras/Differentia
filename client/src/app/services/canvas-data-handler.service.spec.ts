import { TestBed } from '@angular/core/testing';

import { CanvasDataHandlerService } from './canvas-data-handler.service';

describe('CanvasDataHandlerService', () => {
  let service: CanvasDataHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasDataHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
