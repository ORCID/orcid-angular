import { TestBed } from '@angular/core/testing'

import { ScriptService } from './script.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ScriptService', () => {
  let service: ScriptService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(ScriptService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
