import { TestBed } from '@angular/core/testing'

import { UserService } from './user.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserSession } from '../../types/session.local'
import { UserInfo } from '../../types'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('UserService', () => {
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
    const service: UserService = TestBed.inject(UserService)
    expect(service).toBeTruthy()
  })
})

export function getUserSession(): UserSession {
  const userSession = {} as UserSession
  userSession.userInfo = {
    REAL_USER_ORCID: '0000-0000-0000-000X',
    EFFECTIVE_USER_ORCID: '0000-0000-0000-000X',
    IS_LOCKED: 'false',
  } as UserInfo
  userSession.loggedIn = true
  userSession.displayName = 'Test Name'
  return userSession
}
