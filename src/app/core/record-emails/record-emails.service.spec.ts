import { TestBed } from '@angular/core/testing'

import { RecordEmailsService } from './record-emails.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordEmailsService', () => {
  let service: RecordEmailsService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        RecordPublicSideBarService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    service = TestBed.inject(RecordEmailsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
