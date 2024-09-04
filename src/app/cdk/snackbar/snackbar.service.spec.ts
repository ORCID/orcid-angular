import { TestBed } from '@angular/core/testing'

import { SnackbarService } from './snackbar.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../window'
import { PlatformInfoService } from '../platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SnackbarService', () => {
  beforeEach(() =>
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
  )

  it('should be created', () => {
    const service: SnackbarService = TestBed.inject(SnackbarService)
    expect(service).toBeTruthy()
  })
})
