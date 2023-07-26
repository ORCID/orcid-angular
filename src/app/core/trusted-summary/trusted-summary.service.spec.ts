import { TestBed } from '@angular/core/testing';

import { TrustedSummaryService } from './trusted-summary.service';

describe('TrustedSummaryService', () => {
  let service: TrustedSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustedSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
