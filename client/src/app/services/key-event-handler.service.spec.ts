import { TestBed } from '@angular/core/testing';

import { KeyEventHandlerService } from './key-event-handler.service';

describe('KeyEventHandlerService', () => {
  let service: KeyEventHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyEventHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
