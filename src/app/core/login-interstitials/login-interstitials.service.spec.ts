import { TestBed } from '@angular/core/testing'

import { LoginInterstitialsService } from './login-interstitials.service'
import { MatLegacyDialog } from '@angular/material/legacy-dialog'
import { InterstitialsService } from 'src/app/cdk/interstitials/interstitials.service'
import { TogglzService } from '../togglz/togglz.service'
import { NEVER } from 'rxjs'

describe('LoginInterstitialsService', () => {
  let service: LoginInterstitialsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatLegacyDialog, useValue: {} },
        {
          provide: InterstitialsService,
          useValue: { getInterstitialsViewed: () => NEVER },
        },
        { provide: TogglzService, useValue: { getStateOf: () => NEVER } },
      ],
    })
    service = TestBed.inject(LoginInterstitialsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
