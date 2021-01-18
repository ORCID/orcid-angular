import { TestBed } from '@angular/core/testing';

import { RecordCountriesService } from './record-countries.service';

describe('RecordCountriesService', () => {
  let service: RecordCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
