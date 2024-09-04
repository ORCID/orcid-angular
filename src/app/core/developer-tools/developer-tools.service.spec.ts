import { TestBed } from '@angular/core/testing'

import { DeveloperToolsService } from './developer-tools.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ErrorHandlerService } from '../error-handler/error-handler.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('DeveloperToolsService', () => {
  let service: DeveloperToolsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ErrorHandlerService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(DeveloperToolsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
