import { TestBed } from '@angular/core/testing'

import { EmailFrequenciesService } from './email-frequencies.service'

describe('EmailFrequenciesService', () => {
  let service: EmailFrequenciesService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(EmailFrequenciesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
