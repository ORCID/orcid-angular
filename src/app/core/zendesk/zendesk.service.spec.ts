import { TestBed } from '@angular/core/testing'

import { ZendeskService } from './zendesk.service'

describe('ZendeskService', () => {
  let service: ZendeskService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ZendeskService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
