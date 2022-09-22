import { TestBed } from '@angular/core/testing';

import { VerifyImageService } from './verify-image.service';

describe('VerifyImageService', () => {
  let service: VerifyImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerifyImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
