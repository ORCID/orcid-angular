import { TestBed } from '@angular/core/testing'

import { RecordEmailsService } from './record-emails.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordPublicSideBarService } from '../record-public-side-bar/record-public-side-bar.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { UntypedFormControl } from '@angular/forms'
import { OrcidValidators } from 'src/app/validators'

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

  it('sends normalized values to account validation and preserves its errors', () => {
    const http = TestBed.inject(HttpTestingController)
    const control = new UntypedFormControl('', {
      validators: [OrcidValidators.additionalEmail],
      asyncValidators: [service.backendEmailValidate([], true)],
    })
    control.setValue('user\u200b@example.org')
    const request = http.expectOne(
      runtimeEnvironment.API_WEB + 'account/validateEmail.json'
    )
    expect(request.request.method).toBe('POST')
    expect(request.request.body).toEqual({ value: 'user@example.org' })
    request.flush({ value: 'user@example.org', errors: ['duplicate_email'] })
    expect(control.errors).toEqual({ backendError: ['duplicate_email'] })

    control.setValue('other\u200b@example.org')
    http
      .expectOne(runtimeEnvironment.API_WEB + 'account/validateEmail.json')
      .flush({ value: 'other@example.org', errors: ['disposable_email'] })
    expect(control.errors).toEqual({
      backendError: ['disposable_email'],
      disposable: true,
    })
    http.verify()
  })

  it('does not revalidate an unchanged saved address', () => {
    const http = TestBed.inject(HttpTestingController)
    const control = new UntypedFormControl('user@example.org', {
      asyncValidators: [
        service.backendEmailValidate(
          [{ value: 'user@example.org' } as any],
          true
        ),
      ],
    })
    expect(control.valid).toBeTrue()
    http.expectNone(runtimeEnvironment.API_WEB + 'account/validateEmail.json')
  })
})
