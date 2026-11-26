import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsTrustedIndividualsSearchComponent } from './settings-trusted-individuals-search.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { SearchService } from '../../../core/search/search.service'
import { AccountTrustedIndividualsService } from '../../../core/account-trusted-individuals/account-trusted-individuals.service'
import { UserService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { of, throwError } from 'rxjs'

describe('SettingsTrustedIndividualsSearchComponent', () => {
  let component: SettingsTrustedIndividualsSearchComponent
  let fixture: ComponentFixture<SettingsTrustedIndividualsSearchComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        FormsModule,
      ],
      declarations: [SettingsTrustedIndividualsSearchComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountTrustedIndividualsService,
        SearchService,
        UserService,
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
    fixture = TestBed.createComponent(SettingsTrustedIndividualsSearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('rejects invalid email and ORCID checksum without searching', () => {
    const search = spyOn(
      TestBed.inject(AccountTrustedIndividualsService),
      'searchInvitation'
    )
    component.search('person@invalid')
    expect(component.error).toBeTruthy()
    component.search('0000-0002-1825-0098')
    expect(component.error).toBeTruthy()
    expect(search).not.toHaveBeenCalled()
  })

  it('searches and sends only on confirmation, emitting once', () => {
    const service = TestBed.inject(AccountTrustedIndividualsService)
    const search = spyOn(service, 'searchInvitation').and.returnValue(
      of({
        status: 'FOUND',
        publicName: 'Name',
        orcid: '0000-0002-1825-0097',
        publicRecordUrl: 'https://orcid.org/0000-0002-1825-0097',
      })
    )
    const send = spyOn(service, 'sendInvitation').and.returnValue(
      of({ status: 'SENT' })
    )
    const emitted = spyOn(component.invitationSent, 'emit')
    component.search('0000-0002-1825-0097')
    expect(search).toHaveBeenCalledWith({
      lookupType: 'ORCID',
      value: '0000-0002-1825-0097',
    })
    expect(send).not.toHaveBeenCalled()
    component.send()
    component.send()
    expect(send).toHaveBeenCalledTimes(1)
    expect(emitted).toHaveBeenCalledTimes(1)
    expect(component.success).toBeTrue()
  })

  it('shows only entered email even if the response contains identity data', () => {
    spyOn(
      TestBed.inject(AccountTrustedIndividualsService),
      'searchInvitation'
    ).and.returnValue(
      of({ status: 'FOUND', publicName: 'Private name', orcid: 'private' })
    )
    component.search('person@example.org')
    fixture.detectChanges()
    expect(fixture.nativeElement.textContent).toContain('person@example.org')
    expect(fixture.nativeElement.textContent).not.toContain('Private name')
  })

  it('handles backend and network failures without emitting success', () => {
    const service = TestBed.inject(AccountTrustedIndividualsService)
    const search = spyOn(service, 'searchInvitation').and.returnValue(
      of({ status: 'SELF' })
    )
    const emitted = spyOn(component.invitationSent, 'emit')
    component.search('person@example.org')
    expect(component.error).toContain('yourself')
    search.and.returnValue(throwError(() => new Error('network')))
    component.search('person@example.org')
    expect(component.error).toBeTruthy()
    expect(component.loading).toBeFalse()
    expect(emitted).not.toHaveBeenCalled()
  })

  it('reports a send rejection without claiming success', () => {
    const service = TestBed.inject(AccountTrustedIndividualsService)
    spyOn(service, 'searchInvitation').and.returnValue(of({ status: 'FOUND' }))
    spyOn(service, 'sendInvitation').and.returnValue(
      of({ status: 'ACTIVE_INVITATION' })
    )
    const emitted = spyOn(component.invitationSent, 'emit')
    component.search('person@example.org')
    component.send()
    expect(component.error).toContain('pending')
    expect(component.success).toBeFalse()
    expect(emitted).not.toHaveBeenCalled()
  })
})
