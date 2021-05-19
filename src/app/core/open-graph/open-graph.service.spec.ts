import { TestBed } from '@angular/core/testing'

import { OpenGraphService } from './open-graph.service'

describe('OpenGraphService', () => {
  let service: OpenGraphService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(OpenGraphService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
