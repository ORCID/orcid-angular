import { TestBed } from '@angular/core/testing'
import { AccountTrustedIndividualsService } from './account-trusted-individuals.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AccountTrustedIndividualsService', () => {
  let service: AccountTrustedIndividualsService

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
    service = TestBed.inject(AccountTrustedIndividualsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
