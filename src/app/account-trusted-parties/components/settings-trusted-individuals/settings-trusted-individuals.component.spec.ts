import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedIndividualsComponent } from './settings-trusted-individuals.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { AccountTrustedIndividualsService } from '../../../core/account-trusted-individuals/account-trusted-individuals.service'

import { DialogRevokeTrustedIndividualsComponent } from '../dialog-revoke-trusted-individuals/dialog-revoke-trusted-individuals.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { of, throwError } from 'rxjs'

describe('SettingsTrustedIndividualsComponent', () => {
  let component: SettingsTrustedIndividualsComponent
  let fixture: ComponentFixture<SettingsTrustedIndividualsComponent>
  let service: AccountTrustedIndividualsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsTrustedIndividualsComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountTrustedIndividualsService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsTrustedIndividualsComponent)
    component = fixture.componentInstance
    service = TestBed.inject(AccountTrustedIndividualsService)
    spyOn(service, 'getInvitationNotices').and.returnValue(of([]))
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('only removes an outcome notice after successful acknowledgement', () => {
    component.notices = [{ invitationToken: 'token', status: 'DECLINED', lookupType: 'EMAIL', enteredEmail: 'delegate@example.org' }]
    const acknowledge = spyOn(service, 'acknowledgeInvitationNotice').and.returnValue(throwError(() => new Error('unavailable')))
    component.acknowledgeNotice('token')
    expect(component.notices.length).toBe(1)
    expect(component.noticeLoadError).toBeTrue()

    acknowledge.and.returnValue(of({ status: 'ACKNOWLEDGED' }))
    component.acknowledgeNotice('token')
    expect(component.notices.length).toBe(0)
  })

  it('refreshes notices after an invitation is sent', () => {
    component.refresh()
    expect(service.getInvitationNotices).toHaveBeenCalledTimes(2)
  })
})
