import { TestBed } from '@angular/core/testing'

import { TrustedIndividualsService } from './trusted-individuals.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'

describe('TrustedIndividualsService', () => {
  let service: TrustedIndividualsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        ErrorHandlerService,
        PlatformInfoService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    service = TestBed.inject(TrustedIndividualsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
