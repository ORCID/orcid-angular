import { TestBed } from '@angular/core/testing';

import { RecordOtherNamesService } from './record-other-names.service';

describe('RecordOtherNamesService', () => {
  let service: RecordOtherNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordOtherNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
