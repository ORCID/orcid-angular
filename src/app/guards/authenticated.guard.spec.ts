import { TestBed } from '@angular/core/testing'

import { AuthenticatedGuard } from './authenticated.guard'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../cdk/window'
import { PlatformInfoService } from '../cdk/platform-info'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { SnackbarService } from '../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AuthenticatedGuard', () => {
  let guard: AuthenticatedGuard

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    guard = TestBed.inject(AuthenticatedGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
