import { TestBed } from '@angular/core/testing';

import { ValidateImageService } from './validate-image.service';

describe('ValidateImageService', () => {
  let service: ValidateImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
