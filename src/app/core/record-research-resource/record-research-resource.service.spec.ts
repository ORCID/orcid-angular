import { TestBed } from '@angular/core/testing';

import { RecordResearchResourceService } from './record-research-resource.service';

describe('RecordResearchResourceService', () => {
  let service: RecordResearchResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordResearchResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
