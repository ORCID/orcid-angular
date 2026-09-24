import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing'

import { ResetPasswordComponent } from './reset-password.component'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
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
import { of, Subject } from 'rxjs'

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

  /*
   * PD-5692: previous passwords cannot be reused. The registry answers with
   * this code when the new password is the current one.
   */
  describe('a reused password', () => {
    const reused = {
      newPassword: {
        errors: ['Pattern.registrationForm.password.previouslyUsed'],
      },
    }

    it('shows the inline error under the password field and saves nothing', async () => {
      await setupWithTokenErrors([])
      spyOnProperty(component.form, 'valid', 'get').and.returnValue(true)
      const recovery = TestBed.inject(PasswordRecoveryService)
      spyOn(recovery, 'resetPasswordEmail').and.returnValue(of(reused as any))
      const redirect = spyOn(component, 'successRedirect')

      component.save()
      fixture.detectChanges()

      const password = component.passwordForm.form.get('password')
      expect(password.hasError('passwordPreviouslyUsed')).toBeTrue()
      expect(redirect).not.toHaveBeenCalled()
      const error: HTMLElement = fixture.nativeElement.querySelector(
        '#cy-password-previously-used-error'
      )
      expect(error.textContent.replace(/\s+/g, ' ').trim()).toBe(
        'Please enter a new password. Previous passwords cannot be reused.'
      )
      expect(error.getAttribute('role')).toBe('alert')
    })

    it('refuses a second save on the page until the password changes', fakeAsync(() => {
      setupWithTokenErrors([])
      tick()
      const http = TestBed.inject(HttpTestingController)
      const answerTheRegistrysChecks = () => {
        tick(1000)
        http
          .match(() => true)
          .forEach((request) =>
            request.flush({
              password: { errors: [] },
              passwordConfirm: { errors: [] },
            })
          )
        tick(1000)
        fixture.detectChanges()
      }
      const recovery = TestBed.inject(PasswordRecoveryService)
      const post = spyOn(recovery, 'resetPasswordEmail').and.returnValue(
        of(reused as any)
      )
      spyOn(component, 'successRedirect')
      component.passwordForm.form.setValue({
        password: 'Current1password',
        passwordConfirm: 'Current1password',
      })
      answerTheRegistrysChecks()
      expect(component.form.valid).toBeTrue()

      component.save()
      tick(1000)
      fixture.detectChanges()
      expect(post).toHaveBeenCalledTimes(1)
      expect(component.form.get('passwordGroup').invalid).toBeTrue()

      // The same password again is refused on the page: nothing is posted
      component.save()
      tick(1000)
      expect(post).toHaveBeenCalledTimes(1)

      // A different password clears the error and can be saved
      component.passwordForm.form.setValue({
        password: 'Another1password',
        passwordConfirm: 'Another1password',
      })
      answerTheRegistrysChecks()
      expect(component.form.valid).toBeTrue()
      discardPeriodicTasks()
      flush()
    }))

    it('returns from the 2FA challenge to the form with the error', fakeAsync(() => {
      setupWithTokenErrors([])
      tick()
      const submitAttempt = new Subject<void>()
      const challenge = {
        submitAttempt,
        cancelAttempt: new Subject<void>(),
        processBackendResponse: jasmine.createSpy('processBackendResponse'),
      }
      const outlet = {
        attachComponentPortal: () => ({
          instance: challenge,
          changeDetectorRef: { detectChanges: () => {} },
        }),
        detach: jasmine.createSpy('detach'),
      }
      component.outlet = outlet as any
      const recovery = TestBed.inject(PasswordRecoveryService)
      spyOn(recovery, 'resetPasswordEmail').and.returnValue(of(reused as any))
      ;(component as any).showAuthenticationChallenge('0000-0001-2345-6789')
      expect(component.showForm).toBeFalse()

      component.form.patchValue({ twoFactorCode: '123456' })
      submitAttempt.next()
      fixture.detectChanges()
      tick()
      fixture.detectChanges()

      expect(outlet.detach).toHaveBeenCalled()
      expect(challenge.processBackendResponse).not.toHaveBeenCalled()
      expect(component.showForm).toBeTrue()
      expect(component.showAuthChallenge).toBeFalse()
      expect(component.form.value.twoFactorCode).toBeNull()
      const password = component.passwordForm.form.get('password')
      expect(password.hasError('passwordPreviouslyUsed')).toBeTrue()
      // The emptied field still reads as empty, so the requirements checklist
      // shows nothing as met, and only the reuse message is shown
      expect(password.hasError('required')).toBeTrue()
      expect(component.passwordForm.validate8orMoreCharacters).toBeTrue()
      const errors = Array.from(
        fixture.nativeElement.querySelectorAll('mat-error')
      ).map((e: HTMLElement) => e.textContent.replace(/\s+/g, ' ').trim())
      expect(errors).toEqual([
        'Please enter a new password. Previous passwords cannot be reused.',
      ])
    }))
  })
})
