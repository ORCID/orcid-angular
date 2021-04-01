import { TestBed } from '@angular/core/testing'

import { TogglzService } from './togglz.service'

describe('TogglzService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: TogglzService = TestBed.inject(TogglzService)
    expect(service).toBeTruthy()
  })
})
