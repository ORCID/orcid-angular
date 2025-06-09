import { TestBed } from '@angular/core/testing'

import { InterstitialsService } from './interstitials.service'
import { UserService } from 'src/app/core'
import { HttpClient } from '@angular/common/http'
import { ActivatedRoute } from '@angular/router'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../window'
import { SnackbarService } from '../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'

describe('InterstitialsService', () => {
  let service: InterstitialsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        SnackbarService,
        MatSnackBar,
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
