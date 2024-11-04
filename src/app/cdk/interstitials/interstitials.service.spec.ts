import { TestBed } from '@angular/core/testing';

import { InterstitialsService } from './interstitials.service';

describe('InterstitialsService', () => {
  let service: InterstitialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterstitialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
