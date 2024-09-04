import { TestBed } from '@angular/core/testing'

import { UserInfoService } from './user-info.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserInfo } from '../../types'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('UserInfoService', () => {
  let service: UserInfoService

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
    service = TestBed.inject(UserInfoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getUserInfo(): UserInfo {
  return {
    REAL_USER_ORCID: '0000-0000-0000-000X',
    EFFECTIVE_USER_ORCID: '0000-0000-0000-000X',
    PRIMARY_EMAIL: 'test@orcid.org',
    IS_PRIMARY_EMAIL_VERIFIED: 'true',
    LOCKED: 'false',
    CLAIMED: 'true',
    HAS_VERIFIED_EMAIL: 'true',
    RECORD_WITH_ISSUES: false,
    LAST_MODIFIED: '2022-08-03 11:30:49.870566',
  } as UserInfo
}
