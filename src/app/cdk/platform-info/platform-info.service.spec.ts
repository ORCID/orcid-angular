import { TestBed } from '@angular/core/testing'

import { PlatformInfoService } from './platform-info.service'

describe('PlatformInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: PlatformInfoService = TestBed.inject(PlatformInfoService)
    expect(service).toBeTruthy()
  })
})
