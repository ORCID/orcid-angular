import { TestBed } from '@angular/core/testing'

import { ZendeskService } from './zendesk.service'
import { WINDOW_PROVIDERS } from '../../cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ZendeskService', () => {
  let service: ZendeskService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WINDOW_PROVIDERS],
    })
    service = TestBed.inject(ZendeskService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
