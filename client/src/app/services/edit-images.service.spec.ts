import { TestBed } from '@angular/core/testing';

import { EditImagesService } from './edit-images.service';

describe('EditImagesService', () => {
  let service: EditImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
