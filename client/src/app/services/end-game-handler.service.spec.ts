import { TestBed } from '@angular/core/testing';

import { EndGameHandlerService } from './end-game-handler.service';

describe('EndGameHandlerService', () => {
  let service: EndGameHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndGameHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
