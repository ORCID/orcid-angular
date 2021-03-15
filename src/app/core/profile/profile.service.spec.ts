import { TestBed } from '@angular/core/testing'

import { ProfileService } from './profile.service'

describe('ProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ProfileService = TestBed.inject(ProfileService)
    expect(service).toBeTruthy()
  })
})
