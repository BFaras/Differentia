import { TestBed } from '@angular/core/testing';

import { StartUpGameService } from './start-up-game.service';

describe('StartUpGameService', () => {
  let service: StartUpGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StartUpGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
