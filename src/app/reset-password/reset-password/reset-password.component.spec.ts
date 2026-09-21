import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResetPasswordComponent } from './reset-password.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RegisterService } from '../../core/register/register.service'
import { PasswordRecoveryService } from '../../core/password-recovery/password-recovery.service'
import { MdePopoverModule } from '../../cdk/popover'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'

import { MatCardModule } from '@angular/material/card'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { FormPasswordComponent } from '../../register/components/form-password/form-password.component'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent
  let fixture: ComponentFixture<ResetPasswordComponent>

  async function setupWithTokenErrors(errors: string[]) {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MdePopoverModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatCardModule,
        MatProgressBarModule,
        MatIconModule,
        MatButtonModule,
        FormPasswordComponent,
      ],
      declarations: [ResetPasswordComponent],
      providers: [
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        RegisterService,
        PasswordRecoveryService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ tokenVerification: { errors } }),
            queryParams: of({}),
            snapshot: { params: { key: 'a-token' } },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ResetPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  beforeEach(() => {
    TestBed.resetTestingModule()
  })

  it('should create', async () => {
    await setupWithTokenErrors([])
    expect(component).toBeTruthy()
  })

  it('shows the reset form when the token is valid', async () => {
    await setupWithTokenErrors([])
    expect(component.alreadyUsedPasswordResetToken).toBeFalsy()
    expect(fixture.nativeElement.textContent).toContain('Reset your password')
  })

  it('shows the already used panel when the token has been used', async () => {
    await setupWithTokenErrors(['alreadyUsedPasswordResetToken'])
    expect(component.alreadyUsedPasswordResetToken).toBeTrue()
    expect(fixture.nativeElement.textContent).toContain(
      'This password reset link has already been used'
    )
    expect(fixture.nativeElement.textContent).toContain(
      'Password and iD recovery'
    )
  })

  it('shows the expired panel when the token has expired', async () => {
    await setupWithTokenErrors(['expiredPasswordResetToken'])
    expect(component.expiredPasswordResetToken).toBeTrue()
    expect(fixture.nativeElement.textContent).toContain(
      'Your password reset link has expired'
    )
  })

  it('shows the invalid panel when the token is invalid', async () => {
    await setupWithTokenErrors(['invalidPasswordResetToken'])
    expect(component.invalidPasswordResetToken).toBeTrue()
    expect(fixture.nativeElement.textContent).toContain(
      'There is a problem with your password reset link'
    )
  })
})
