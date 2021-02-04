import { TestBed } from '@angular/core/testing';

import { RecordBiographyService } from './record-biography.service';

describe('RecordBiographyService', () => {
  let service: RecordBiographyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordBiographyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
