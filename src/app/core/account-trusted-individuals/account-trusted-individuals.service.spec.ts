import { TestBed } from '@angular/core/testing'
import { AccountTrustedIndividualsService } from './account-trusted-individuals.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
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

  it('uses the invitation endpoints and request bodies', () => {
    const http = TestBed.inject(HttpTestingController)
    const request = {
      lookupType: 'EMAIL' as const,
      value: 'person@example.org',
    }
    service
      .searchInvitation(request)
      .subscribe((result) => expect(result.status).toBe('FOUND'))
    const search = http.expectOne(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/search.json'
    )
    expect(search.request.method).toBe('POST')
    expect(search.request.body).toEqual(request)
    search.flush({ status: 'FOUND' })
    service
      .sendInvitation(request)
      .subscribe((result) => expect(result.status).toBe('SENT'))
    const send = http.expectOne(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/send.json'
    )
    expect(send.request.body).toEqual(request)
    send.flush({ status: 'SENT' })
    service
      .getInvitationNotices()
      .subscribe((notices) => expect(notices.length).toBe(1))
    const notices = http.expectOne(
      runtimeEnvironment.API_WEB + 'account/delegate-invitations/notices.json'
    )
    expect(notices.request.method).toBe('GET')
    notices.flush([
      {
        invitationId: 42,
        status: 'ACCEPTED',
        lookupType: 'EMAIL',
        enteredEmail: 'person@example.org',
        lastModified: null,
      },
    ])
    service
      .acknowledgeInvitationNotice(42)
      .subscribe((result) => expect(result.status).toBe('ACKNOWLEDGED'))
    const acknowledge = http.expectOne(
      runtimeEnvironment.API_WEB +
        'account/delegate-invitations/notices/acknowledge.json'
    )
    expect(acknowledge.request.body).toEqual({ invitationId: 42 })
    acknowledge.flush({ status: 'ACKNOWLEDGED' })
    http.verify()
  })
})
