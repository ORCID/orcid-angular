import { TestBed } from '@angular/core/testing'

import { InboxService } from './inbox.service'

describe('InboxService', () => {
  let service: InboxService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(InboxService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
