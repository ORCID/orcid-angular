import { TestBed } from '@angular/core/testing';

import { RecordPublicSideBarService } from './record-public-side-bar.service';

describe('RecordPublicSideBarService', () => {
  let service: RecordPublicSideBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordPublicSideBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
