import { TestBed } from '@angular/core/testing'

import { ReactivationService } from './reactivation.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

describe('ReactivationService', () => {
  let service: ReactivationService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    })
    service = TestBed.inject(ReactivationService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
