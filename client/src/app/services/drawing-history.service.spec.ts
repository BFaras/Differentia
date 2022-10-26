import { TestBed } from '@angular/core/testing';

import { DrawingHistoryService } from './drawing-history.service';

describe('DrawingHistoryService', () => {
  let service: DrawingHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
