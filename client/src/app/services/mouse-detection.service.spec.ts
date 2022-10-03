import { TestBed } from '@angular/core/testing';

import { MouseDetectionService } from './mouse-detection.service';

describe('MouseDetectionService', () => {
  let service: MouseDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
