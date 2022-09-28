import { TestBed } from '@angular/core/testing';

import { ImageToImageDifferenceService } from './image-to-image-difference.service';

describe('ImageToImageDifferenceService', () => {
  let service: ImageToImageDifferenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageToImageDifferenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
