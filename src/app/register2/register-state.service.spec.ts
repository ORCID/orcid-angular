import { TestBed } from '@angular/core/testing'

import { RegisterStateService } from './register-state.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { OrganizationsService } from '../core'

describe('RegisterStateService', () => {
  let service: RegisterStateService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: OrganizationsService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(RegisterStateService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
