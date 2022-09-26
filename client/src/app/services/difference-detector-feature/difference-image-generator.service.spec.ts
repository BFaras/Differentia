import { TestBed } from '@angular/core/testing';

import { DifferenceImageGeneratorService } from './difference-image-generator.service';

describe('DifferenceImageGeneratorService', () => {
  let service: DifferenceImageGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DifferenceImageGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
