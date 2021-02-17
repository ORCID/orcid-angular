import { TestBed } from '@angular/core/testing';

import { RecordWebsitesService } from './record-websites.service';

describe('RecordWebsitesService', () => {
  let service: RecordWebsitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordWebsitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
