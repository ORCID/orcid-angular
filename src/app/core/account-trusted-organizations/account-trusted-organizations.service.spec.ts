import { TestBed } from '@angular/core/testing';

import { AccountTrustedOrganizationsService } from './account-trusted-organizations.service';

describe('AccountTrustedOrganizationsService', () => {
  let service: AccountTrustedOrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountTrustedOrganizationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
