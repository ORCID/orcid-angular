import { TestBed, fakeAsync, tick } from '@angular/core/testing'

import { UserService } from './user.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserSession } from '../../types/session.local'
import { UserInfo } from '../../types'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of } from 'rxjs'
import { DiscoService } from '../disco/disco.service'
import { OauthService } from '../oauth/oauth.service'
import { UserInfoService } from '../user-info/user-info.service'
import { TogglzService } from '../togglz/togglz.service'
import { CookieService } from 'ngx-cookie-service'

describe('UserService', () => {
  beforeEach(() => {
    const platformInfoServiceMock = {
      get: () =>
        of({
          hasOauthParameters: false,
          social: false,
          institutional: false,
          currentRoute: 'signin',
          queryParameters: {},
        }),
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        { provide: PlatformInfoService, useValue: platformInfoServiceMock },
        {
          provide: OauthService,
          useValue: { declareOauthSession: () => of(null) },
        },
        {
          provide: DiscoService,
          useValue: { getInstitutionNameBaseOnId: () => of('') },
        },
        { provide: UserInfoService, useValue: { getUserInfo: () => of({} as UserInfo) } },
        {
          provide: TogglzService,
          useValue: { getStateOf: () => of(false), reportUserStatusChecked: () => {} },
        },
        { provide: CookieService, useValue: { get: () => '' } },
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
  })

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService)
    expect(service).toBeTruthy()
  })

  it('does not duplicate refresh triggers after repeated tab hide/show', fakeAsync(() => {
    const service: UserService = TestBed.inject(UserService)

    const getUserStatusSpy = spyOn(service, 'getUserStatus').and.returnValue(
      of(false)
    )

    // Ensure the internal session stream is initialized (this will trigger an initial status check).
    service.getUserSession().subscribe()
    tick()

    // Repeatedly simulate tab visibility changes (this toggles the refresh interval).
    for (let i = 0; i < 5; i++) {
      service.setTimerAsHiddenState(true)
      service.setTimerAsHiddenState(false)
    }

    // Now trigger one explicit refresh.
    // Let any "immediate" timer tick from the last visibility change run.
    tick()
    const callsBefore = getUserStatusSpy.calls.count()
    service.refreshUserSession(true).subscribe()
    tick()

    // Before the fix, multiple active subscriptions meant this could increment by > 1.
    expect(getUserStatusSpy.calls.count() - callsBefore).toBe(1)
  }))
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
