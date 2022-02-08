import { TestBed } from '@angular/core/testing';

import { AccountAlternateSignInService } from './account-alternate-sign-in.service';

describe('AccountAlternateSignInService', () => {
  let service: AccountAlternateSignInService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountAlternateSignInService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
