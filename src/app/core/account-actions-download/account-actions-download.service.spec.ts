import { TestBed } from '@angular/core/testing'

import { AccountActionsDownloadService } from './account-actions-download.service'

describe('AccountActionsDownloadService', () => {
  let service: AccountActionsDownloadService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountActionsDownloadService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
