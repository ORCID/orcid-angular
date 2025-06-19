import { TestBed } from '@angular/core/testing'

import { VerificationEmailModalService } from './verification-email-modal.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('VerificationEmailModalService', () => {
  let service: VerificationEmailModalService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
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
    service = TestBed.inject(VerificationEmailModalService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
