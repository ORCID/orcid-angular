import { TestBed } from '@angular/core/testing'

import { AccountActionsDuplicatedService } from './account-actions-duplicated.service'

describe('AccountActionsDuplicatedService', () => {
  let service: AccountActionsDuplicatedService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountActionsDuplicatedService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
