import { TestBed } from '@angular/core/testing'

import { RobotsMetaTagsService } from './robots-meta-tags.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RobotsMetaTagsService', () => {
  let service: RobotsMetaTagsService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RobotsMetaTagsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
