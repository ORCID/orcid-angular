import { TestBed } from '@angular/core/testing';

import { VerificationEmailModalService } from './verification-email-modal.service';

describe('VerificationEmailModalService', () => {
  let service: VerificationEmailModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationEmailModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
