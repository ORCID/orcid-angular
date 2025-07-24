import { TestBed } from '@angular/core/testing'

import { OauthURLSessionManagerService } from './oauth-urlsession-manager.service'

describe('OauthURLSessionManagerService', () => {
  let service: OauthURLSessionManagerService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(OauthURLSessionManagerService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
