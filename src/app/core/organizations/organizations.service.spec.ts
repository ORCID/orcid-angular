import { TestBed } from '@angular/core/testing'

import { OrganizationsService } from './organizations.service'

describe('OrganizationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: OrganizationsService = TestBed.inject(OrganizationsService)
    expect(service).toBeTruthy()
  })
})
