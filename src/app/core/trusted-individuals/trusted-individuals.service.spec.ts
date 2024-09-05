import { TestBed } from '@angular/core/testing'

import { TrustedIndividualsService } from './trusted-individuals.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TrustedIndividualsService', () => {
  let service: TrustedIndividualsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(TrustedIndividualsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
