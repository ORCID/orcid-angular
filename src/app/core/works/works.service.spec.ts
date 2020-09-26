import { TestBed } from '@angular/core/testing'

import { WorksService } from './works.service'

describe('WorksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: WorksService = TestBed.inject(WorksService)
    expect(service).toBeTruthy()
  })
})
