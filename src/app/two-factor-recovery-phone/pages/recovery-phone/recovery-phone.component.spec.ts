import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { EventEmitter } from '@angular/core'
import { Subject, of, throwError } from 'rxjs'
import IntlTelInput from '@intl-tel-input/angular'

import { RecoveryPhoneComponent } from './recovery-phone.component'
import { ApplicationRoutes } from '../../../constants'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { Status } from '../../../types/two-factor.endpoint'

describe('RecoveryPhoneComponent', () => {
  let component: RecoveryPhoneComponent
  let fixture: ComponentFixture<RecoveryPhoneComponent>
  let twoFactorService: jasmine.SpyObj<TwoFactorAuthenticationService>
  let togglzService: jasmine.SpyObj<TogglzService>
  let dialog: jasmine.SpyObj<MatDialog>
  let router: Router

  // Stands in for the auth challenge dialog the page opens on load
  let submitAttempt: EventEmitter<void>
  let cancelAttempt: EventEmitter<void>
  let afterClosed: Subject<boolean>
  let dialogInstance: any
  let dialogRef: any

  const status = (overrides: Partial<Status> = {}): Status =>
    ({ enabled: true, ...overrides }) as Status

  function build(flagEnabled = true, statusValue: Status = status()) {
    togglzService.getStateOf.and.returnValue(of(flagEnabled))
    twoFactorService.checkState.and.returnValue(of(statusValue))
    fixture = TestBed.createComponent(RecoveryPhoneComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  /** Drives the challenge dialog to a pass, which is what unlocks the form. */
  function passChallenge() {
    twoFactorService.verifyRecoveryPhoneChallenge.and.returnValue(
      of({ success: true } as any)
    )
    submitAttempt.emit()
    afterClosed.next(true)
    fixture.detectChanges()
  }

  beforeEach(async () => {
    submitAttempt = new EventEmitter<void>()
    cancelAttempt = new EventEmitter<void>()
    afterClosed = new Subject<boolean>()
    dialogInstance = {
      submitAttempt,
      cancelAttempt,
      loading: false,
      processBackendResponse: jasmine.createSpy('processBackendResponse'),
    }
    dialogRef = {
      componentInstance: dialogInstance,
      afterClosed: () => afterClosed.asObservable(),
      close: jasmine.createSpy('close').and.callFake((value?: boolean) => {
        afterClosed.next(!!value)
      }),
    } as unknown as MatDialogRef<any>

    twoFactorService = jasmine.createSpyObj('TwoFactorAuthenticationService', [
      'checkState',
      'verifyRecoveryPhoneChallenge',
      'sendRecoveryPhoneCode',
      'saveRecoveryPhone',
    ])
    togglzService = jasmine.createSpyObj('TogglzService', ['getStateOf'])
    dialog = jasmine.createSpyObj('MatDialog', ['open'])
    dialog.open.and.returnValue(dialogRef)

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, IntlTelInput],
      declarations: [RecoveryPhoneComponent],
      providers: [
        { provide: TwoFactorAuthenticationService, useValue: twoFactorService },
        { provide: TogglzService, useValue: togglzService },
        { provide: MatDialog, useValue: dialog },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    router = TestBed.inject(Router)
    spyOn(router, 'navigate')
  })

  it('sends the user back to account settings when the feature is off', () => {
    build(false)

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ fragment: '2FA' })
    )
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('sends the user back when 2FA is not enabled', () => {
    build(true, status({ enabled: false }))

    expect(router.navigate).toHaveBeenCalled()
    expect(dialog.open).not.toHaveBeenCalled()
  })

  it('asks for the authentication challenge before anything else', () => {
    build()

    expect(dialog.open).toHaveBeenCalled()
    expect(component.title).toBe('Add a recovery phone number')
  })

  it('treats an existing number as a change rather than an addition', () => {
    build(true, status({ maskedRecoveryPhoneNumber: '***********1234' }))

    expect(component.managingExistingNumber).toBeTrue()
    expect(component.title).toBe('Manage your recovery phone number')
    expect(component.primaryLabel).toBe('Update recovery phone number')
    expect(component.maskedRecoveryPhoneNumber).toBe('***********1234')
  })

  it('leaves the page when the challenge is cancelled', () => {
    build()
    ;(router.navigate as jasmine.Spy).calls.reset()

    afterClosed.next(false)

    expect(router.navigate).toHaveBeenCalled()
  })

  it('reports a failed challenge back into the dialog', () => {
    build()
    twoFactorService.verifyRecoveryPhoneChallenge.and.returnValue(
      of({ success: false, invalidPassword: true } as any)
    )

    submitAttempt.emit()

    expect(dialogInstance.processBackendResponse).toHaveBeenCalled()
    expect(dialogRef.close).not.toHaveBeenCalledWith(true)
  })

  it('enables the code field and starts the countdown once a code is sent', () => {
    build()
    passChallenge()
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({ success: true, resendAfterSeconds: 30 })
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')

    component.sendCode()

    expect(component.codeSent).toBeTrue()
    expect(component.verificationCodeControl?.enabled).toBeTrue()
    expect(component.resendCountdown).toBe(30)
    // the number is locked while a code is outstanding
    expect(component.phoneNumberControl?.disabled).toBeTrue()
  })

  it('counts the resend buffer down and frees the number again', fakeAsync(() => {
    build()
    passChallenge()
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({ success: true, resendAfterSeconds: 2 })
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')
    component.sendCode()

    tick(2000)

    expect(component.resendCountdown).toBe(0)
    expect(component.phoneNumberControl?.enabled).toBeTrue()
    component.ngOnDestroy()
  }))

  it('restarts the countdown cleanly on a second send', fakeAsync(() => {
    build()
    passChallenge()
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({ success: true, resendAfterSeconds: 3 })
    )
    component.form.get('phoneNumber')?.setValue('+441234567890')
    component.sendCode()
    tick(3000)

    component.sendCode()
    tick(1000)

    // one tick, one second gone: a leftover countdown would double the rate
    expect(component.resendCountdown).toBe(2)
    component.ngOnDestroy()
  }))

  it('names the problem the phone field already found, rather than calling it required', () => {
    build()
    passChallenge()
    const control = component.form.get('phoneNumber')
    control?.setValue('+441234')
    control?.setErrors({ invalidPhone: 'IS_POSSIBLE_LOCAL_ONLY' })

    component.sendCode()

    expect(component.phoneErrorMessage).toBe('Phone number is too short')
    expect(twoFactorService.sendRecoveryPhoneCode).not.toHaveBeenCalled()
  })

  it('still asks for a number when the field is empty', () => {
    build()
    passChallenge()

    component.sendCode()

    expect(component.phoneErrorMessage).toBe('Phone number is required')
  })

  it('shows the length problem the server reports for the number', () => {
    build()
    passChallenge()
    twoFactorService.sendRecoveryPhoneCode.and.returnValue(
      of({ success: false, errorCode: 'PHONE_TOO_SHORT', resendAfterSeconds: 0 })
    )
    component.form.get('phoneNumber')?.setValue('+441234')

    component.sendCode()

    expect(component.phoneErrorMessage).toBe('Phone number is too short')
    expect(component.codeSent).toBeFalse()
  })

  it('asks for a code before saving', () => {
    build()
    passChallenge()

    component.save()

    expect(component.codeErrorMessage).toBe('A verification code is required')
    expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
  })

  it('rejects a code that is not six digits', () => {
    build()
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('12345')

    component.save()

    expect(component.codeErrorMessage).toBe('Invalid verification code length')
    expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
  })

  it('reports a rejected code without leaving the page', () => {
    build()
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('000000')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: 'INVALID_CODE' })
    )
    ;(router.navigate as jasmine.Spy).calls.reset()

    component.save()

    expect(component.codeErrorMessage).toBe('Invalid verification code')
    expect(router.navigate).not.toHaveBeenCalled()
  })

  it('clears the code entry when it has expired', () => {
    build()
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    component.codeSent = true
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: 'CODE_EXPIRED' })
    )

    component.save()

    expect(component.codeSent).toBeFalse()
    expect(component.verificationCodeControl?.disabled).toBeTrue()
  })

  it('asks for the challenge again when the elevation has run out', () => {
    build()
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: false, errorCode: 'CHALLENGE_REQUIRED' })
    )
    dialog.open.calls.reset()

    component.save()

    expect(dialog.open).toHaveBeenCalled()
    // what they typed is still there
    expect(component.verificationCodeControl?.value).toBe('123456')
  })

  it('returns with the added outcome after a first number is stored', () => {
    build()
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      of({ success: true, maskedRecoveryPhoneNumber: '***********1234' })
    )
    ;(router.navigate as jasmine.Spy).calls.reset()

    component.save()

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: { recoveryPhone: 'added' } })
    )
  })

  it('returns with the updated outcome after a number is changed', () => {
    build(true, status({ maskedRecoveryPhoneNumber: '***********1234' }))
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(of({ success: true }))
    ;(router.navigate as jasmine.Spy).calls.reset()

    component.save()

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: { recoveryPhone: 'updated' } })
    )
  })

  it('reports a failure when saving breaks', () => {
    build()
    passChallenge()
    component.verificationCodeControl?.enable()
    component.verificationCodeControl?.setValue('123456')
    twoFactorService.saveRecoveryPhone.and.returnValue(
      throwError(() => new Error('boom'))
    )
    ;(router.navigate as jasmine.Spy).calls.reset()

    component.save()

    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: { recoveryPhone: 'failed' } })
    )
  })

  it('leaves without saving anything when cancelled', () => {
    build()
    passChallenge()
    ;(router.navigate as jasmine.Spy).calls.reset()

    component.cancel()

    expect(twoFactorService.saveRecoveryPhone).not.toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(
      [ApplicationRoutes.account],
      jasmine.objectContaining({ queryParams: {} })
    )
  })
})
