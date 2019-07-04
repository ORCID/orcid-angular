import { TestBed } from '@angular/core/testing'

import { TogglzService } from './togglz.service'

describe('TogglzService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: TogglzService = TestBed.get(TogglzService)
    expect(service).toBeTruthy()
  })
})
