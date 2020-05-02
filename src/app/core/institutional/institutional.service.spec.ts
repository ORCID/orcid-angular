import { TestBed } from '@angular/core/testing';

import { InstitutionalService } from './institutional.service';

describe('InstitutionalService', () => {
  let service: InstitutionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
