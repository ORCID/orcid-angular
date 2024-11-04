import { TestBed } from '@angular/core/testing'

import { InterstitialsService } from './interstitials.service'
import { UserService } from 'src/app/core'

describe('InterstitialsService', () => {
  let service: InterstitialsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: UserService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(InterstitialsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
