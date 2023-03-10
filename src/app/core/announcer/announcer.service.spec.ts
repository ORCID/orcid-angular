import { TestBed } from '@angular/core/testing';

import { AnnouncerService } from './announcer.service';

describe('AnnouncerService', () => {
  let service: AnnouncerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
