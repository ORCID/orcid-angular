import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { AuthChallengeComponent } from './auth-challenge.component'
import { By } from '@angular/platform-browser'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import '@angular/localize/init'

describe('AuthChallengeComponent', () => {
  let fixture: ComponentFixture<AuthChallengeComponent>
  let component: AuthChallengeComponent
  let form: FormGroup
  let mockDialogRef: any

  beforeEach(async () => {
    form = new FormGroup({
      passwordControl: new FormControl(''),
      twoFactorCode: new FormControl(''),
      twoFactorRecoveryCode: new FormControl(''),
    })

    mockDialogRef = {
      updateSize: jasmine.createSpy('updateSize'),
      close: jasmine.createSpy('close'),
    }

    const mockDialogData = {
      parentForm: form,
      showPasswordField: true,
      showTwoFactorField: true,
      showHelpText: true,
      codeControlName: 'twoFactorCode',
      recoveryControlName: 'twoFactorRecoveryCode',
      passwordControlName: 'passwordControl',
      actionDescription: 'login',
    }

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AuthChallengeComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AuthChallengeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create and set default size', () => {
    expect(component).toBeTruthy()
    expect(mockDialogRef.updateSize).toHaveBeenCalledWith('580px')
  })

  describe('Initialization', () => {
    it('should set Validators.required on the 2FA Code by default and mark as untouched', () => {
      const codeControl = form.get('twoFactorCode')
      const recoveryControl = form.get('twoFactorRecoveryCode')

      codeControl?.setValue('')
      expect(codeControl?.hasError('required')).toBeTrue()
      expect(codeControl?.touched).toBeFalse()

      recoveryControl?.setValue('')
      expect(recoveryControl?.hasError('required')).toBeFalse()
    })
  })

  describe('Toggling Recovery Code Mode', () => {
    it('should switch to Recovery mode when toggle link is clicked', fakeAsync(() => {
      const toggleLink = fixture.debugElement.query(
        By.css('[data-testid="recovery-toggle"]')
      ).nativeElement

      toggleLink.click()
      fixture.detectChanges()
      tick()

      expect(component.showRecoveryCode).toBeTrue()

      const codeControl = form.get('twoFactorCode')
      const recoveryControl = form.get('twoFactorRecoveryCode')

      codeControl?.setValue('')
      expect(codeControl?.hasError('required')).toBeFalse()

      recoveryControl?.setValue('')
      expect(recoveryControl?.hasError('required')).toBeTrue()

      const recoveryInput = fixture.debugElement.query(
        By.css('#twoFactorRecoveryCode')
      )
      const codeInput = fixture.debugElement.query(By.css('#twoFactorCode'))

      expect(recoveryInput).toBeTruthy()
      expect(codeInput).toBeFalsy()
    }))

    it('should focus the input when switching modes', fakeAsync(() => {
      component.toggleRecoveryCode(new Event('click'))

      fixture.detectChanges()
      tick()

      const recoveryInputEl = fixture.debugElement.query(
        By.css('#twoFactorRecoveryCode')
      ).nativeElement

      expect(document.activeElement).toBe(recoveryInputEl)
    }))

    it('should clear values when switching modes', () => {
      form.get('twoFactorCode')?.setValue('123456')
      component.toggleRecoveryCode(new Event('click'))
      expect(form.get('twoFactorCode')?.value).toBeNull()
    })
  })

  describe('Backend Response Handling', () => {
    it('should apply backend error to password control', () => {
      component.processBackendResponse({ invalidPassword: true })

      const control = form.get('passwordControl')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should apply backend error to 2FA code', () => {
      component.processBackendResponse({ invalidTwoFactorCode: true })

      const control = form.get('twoFactorCode')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should apply backend error to Recovery code', () => {
      component.processBackendResponse({ invalidTwoFactorRecoveryCode: true })

      const control = form.get('twoFactorRecoveryCode')
      expect(control?.hasError('invalid')).toBeTrue()
    })
  })

  describe('Component properties (formerly Dialog Data @Input)', () => {
    it('should hide two-factor field if showTwoFactorField is false', () => {
      // Set on the component property directly — the template binds to this,
      // not to data, since ngOnInit already copied data into component fields
      component.showTwoFactorField = false
      fixture.detectChanges()

      const codeInput = fixture.debugElement.query(By.css('#twoFactorCode'))
      expect(codeInput).toBeFalsy()
    })

    it('should hide password field if showPasswordField is false', () => {
      component.showPasswordField = false
      fixture.detectChanges()

      const passwordInput = fixture.debugElement.query(By.css('#password'))
      expect(passwordInput).toBeFalsy()
    })
  })

  describe('Submission & Cleanup', () => {
    it('should emit submitAttempt and trigger loading state on submit', () => {
      spyOn(component.submitAttempt, 'emit')
      component.onSubmit()

      expect(component.loading).toBeTrue()
      expect(component.submitAttempt.emit).toHaveBeenCalled()
    })

    it('should clear forms and remove validators on destroy', () => {
      component.ngOnDestroy()

      const codeControl = form.get('twoFactorCode')
      const recoveryControl = form.get('twoFactorRecoveryCode')

      expect(codeControl?.value).toBeNull()
      expect(recoveryControl?.value).toBeNull()

      expect(codeControl?.hasValidator(Validators.required)).toBeFalse()
      expect(recoveryControl?.hasValidator(Validators.required)).toBeFalse()
    })
  })
})
