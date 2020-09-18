import { TestBed } from '@angular/core/testing';

import { LanguageGuard } from './language.guard';

describe('LanguageGuard', () => {
  let guard: LanguageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LanguageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
