import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PasswordRecoveryComponent } from './password-recovery.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { PasswordRecoveryService } from '../../../core/password-recovery/password-recovery.service'
import { MatChipsModule } from '@angular/material/chips'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormPasswordComponent } from '../../../register/components/form-password/form-password.component'
import { MatRadioModule } from '@angular/material/radio'

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent
  let fixture: ComponentFixture<PasswordRecoveryComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatChipsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormPasswordComponent,
        MatRadioModule,
      ],
      declarations: [PasswordRecoveryComponent],
      providers: [
        WINDOW_PROVIDERS,
        PasswordRecoveryService,
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
    fixture = TestBed.createComponent(PasswordRecoveryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  /** Renders the confirmation branch for the given recovery type and returns its text. */
  function confirmationTextFor(recoveryType: string): string {
    component.recoveryForm.get('recoveryType').setValue(recoveryType)
    component.recoveryForm.get('email').setValue('josiah_carberry@brown.edu')
    component.submitted = true
    fixture.detectChanges()
    return fixture.nativeElement.textContent
  }

  it('mentions the other verified addresses after a password reset', () => {
    expect(confirmationTextFor('password')).toContain(
      'and any other verified email addresses on your account'
    )
  })

  it('does not mention other verified addresses on the forgot-iD path', () => {
    // /forgot-id.json still emails a single address, so the fan out wording would be a lie here.
    expect(confirmationTextFor('orcidId')).not.toContain(
      'and any other verified email addresses on your account'
    )
  })

  it('still shows the submitted email in both modes', () => {
    expect(confirmationTextFor('password')).toContain(
      'josiah_carberry@brown.edu'
    )
    expect(confirmationTextFor('orcidId')).toContain(
      'josiah_carberry@brown.edu'
    )
  })
})
