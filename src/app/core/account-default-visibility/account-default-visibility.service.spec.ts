import { TestBed } from '@angular/core/testing'

import { AccountDefaultVisibilityService } from './account-default-visibility.service'

describe('AccountDefaultVisibilityService', () => {
  let service: AccountDefaultVisibilityService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountDefaultVisibilityService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
