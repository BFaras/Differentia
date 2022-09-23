import { TestBed } from '@angular/core/testing';

import { GameDifferencesService } from './game-differences.service';

describe('GameDifferencesService', () => {
  let service: GameDifferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDifferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
