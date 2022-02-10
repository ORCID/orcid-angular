import { TestBed } from '@angular/core/testing'

import { AccountActionsDeactivateService } from './account-actions-deactivate.service'

describe('AccountActionsDeactivateService', () => {
  let service: AccountActionsDeactivateService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountActionsDeactivateService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
