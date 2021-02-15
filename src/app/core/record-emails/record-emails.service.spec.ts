import { TestBed } from '@angular/core/testing'

import { RecordEmailsService } from './record-emails.service'

describe('RecordEmailsService', () => {
  let service: RecordEmailsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordEmailsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
