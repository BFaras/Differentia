import { TestBed } from '@angular/core/testing';

import { AssignImageDataService } from './assign-image-data.service';

describe('AssignImageDataService', () => {
  let service: AssignImageDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignImageDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
