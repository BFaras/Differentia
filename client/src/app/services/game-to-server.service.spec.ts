import { TestBed } from '@angular/core/testing';

import { GameToServerService } from './game-to-server.service';

describe('GameToServerService', () => {
  let service: GameToServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameToServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
