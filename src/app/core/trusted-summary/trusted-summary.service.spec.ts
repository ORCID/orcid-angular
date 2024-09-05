import { TestBed } from '@angular/core/testing'

import { TrustedSummaryService } from './trusted-summary.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TrustedSummaryService', () => {
  let service: TrustedSummaryService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ErrorHandlerService, userValue: {} },
        {
          provide: ErrorHandlerService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(TrustedSummaryService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
