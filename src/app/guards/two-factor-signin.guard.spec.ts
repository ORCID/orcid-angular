import { TestBed } from '@angular/core/testing'
import { TwoFactorSigninGuard } from './two-factor-signin.guard'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../cdk/window'
import { PlatformInfoService } from '../cdk/platform-info'
import { ErrorHandlerService } from '../core/error-handler/error-handler.service'
import { SnackbarService } from '../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

describe('TwoFactorSigninGuard', () => {
  let guard: TwoFactorSigninGuard

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
    guard = TestBed.inject(TwoFactorSigninGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
