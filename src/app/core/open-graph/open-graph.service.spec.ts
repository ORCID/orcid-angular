import { TestBed } from '@angular/core/testing'

import { OpenGraphService } from './open-graph.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('OpenGraphService', () => {
  let service: OpenGraphService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OpenGraphService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(OpenGraphService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
