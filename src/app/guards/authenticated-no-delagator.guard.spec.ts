import { TestBed } from '@angular/core/testing'

import { AuthenticatedNoDelegatorGuard } from './authenticated-no-delagator.guard'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../cdk/window'
import { UserService } from '../core'
import { PlatformInfoService } from '../cdk/platform-info'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { SnackbarService } from '../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AuthenticatedNoDelegatorGuard', () => {
  let guard: AuthenticatedNoDelegatorGuard

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    guard = TestBed.inject(AuthenticatedNoDelegatorGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
