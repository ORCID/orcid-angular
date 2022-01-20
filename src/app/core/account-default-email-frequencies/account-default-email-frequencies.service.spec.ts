import { TestBed } from '@angular/core/testing'

import { AccountDefaultEmailFrequenciesService } from './account-default-email-frequencies.service'

describe('EmailFrequenciesService', () => {
  let service: AccountDefaultEmailFrequenciesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(AccountDefaultEmailFrequenciesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
