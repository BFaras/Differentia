import { TestBed } from '@angular/core/testing';

import { DrawingHandlerService } from './drawing-handler.service';

describe('DrawingHandlerService', () => {
  let service: DrawingHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
