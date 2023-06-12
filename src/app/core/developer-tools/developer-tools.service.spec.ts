import { TestBed } from '@angular/core/testing';

import { DeveloperToolsService } from './developer-tools.service';

describe('DeveloperToolsService', () => {
  let service: DeveloperToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeveloperToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
