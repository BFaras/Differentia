import { TestBed } from '@angular/core/testing';

import { ClueHandlerService } from './clue-handler.service';

describe('ClueHandlerService', () => {
  let service: ClueHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClueHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
