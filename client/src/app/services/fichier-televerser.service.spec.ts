import { TestBed } from '@angular/core/testing';

import { FichierTeleverserService } from './fichier-televerser.service';

describe('FichierTeleverserService', () => {
  let service: FichierTeleverserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichierTeleverserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
