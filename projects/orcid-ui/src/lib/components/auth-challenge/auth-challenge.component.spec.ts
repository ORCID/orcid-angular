import { Component, ViewChild } from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { AuthChallengeComponent } from './auth-challenge.component'
import { AlertMessageComponent } from '../alert-message/alert-message.component'
import { By } from '@angular/platform-browser'
import '@angular/localize/init'

// 1. Define a Host Component to simulate the Parent Form
@Component({
  template: `
    <form [formGroup]="form">
      <app-auth-challenge
        [showAlert]="showAlert"
        [showHelpText]="showHelpText"
        [showTwoFactorField]="showTwoFactorField"
        [showPasswordField]="showPasswordField"
        codeControlName="twoFactorCode"
        recoveryControlName="twoFactorRecoveryCode"
        passwordControlName="passwordControl"
      >
      </app-auth-challenge>
    </form>
  `,
  standalone: true,
  imports: [ReactiveFormsModule, AuthChallengeComponent],
})
class TestHostComponent {
  @ViewChild(AuthChallengeComponent)
  childComponent!: AuthChallengeComponent

  showAlert = false
  showHelpText = true
  showTwoFactorField = true
  showPasswordField = true

  form = new FormGroup({
    passwordControl: new FormControl(''),
    twoFactorCode: new FormControl(''),
    twoFactorRecoveryCode: new FormControl(''),
  })
}

describe('AuthChallengeComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>
  let hostComponent: TestHostComponent
  let component: AuthChallengeComponent

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TestHostComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TestHostComponent)
    hostComponent = fixture.componentInstance

    fixture.detectChanges()
    component = hostComponent.childComponent
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  describe('Initialization', () => {
    it('should set Validators.required on the 2FA Code by default', () => {
      const codeControl = hostComponent.form.get('twoFactorCode')
      const recoveryControl = hostComponent.form.get('twoFactorRecoveryCode')

      codeControl?.setValue('')
      expect(codeControl?.hasError('required')).toBeTrue()

      recoveryControl?.setValue('')
      expect(recoveryControl?.hasError('required')).toBeFalse()
    })
  })

  describe('Toggling Recovery Code Mode', () => {
    it('should switch to Recovery mode when toggle link is clicked', fakeAsync(() => {
      // Robust query using data-testid instead of CSS classes
      const toggleLink = fixture.debugElement.query(
        By.css('[data-testid="recovery-toggle"]')
      ).nativeElement

      toggleLink.click()
      fixture.detectChanges()
      tick()

      expect(component.showRecoveryCode).toBeTrue()

      const codeControl = hostComponent.form.get('twoFactorCode')
      const recoveryControl = hostComponent.form.get('twoFactorRecoveryCode')

      codeControl?.setValue('')
      expect(codeControl?.hasError('required')).toBeFalse()

      recoveryControl?.setValue('')
      expect(recoveryControl?.hasError('required')).toBeTrue()

      // IDs are safe to query by, as they are functionally required for a11y labels
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
      hostComponent.form.get('twoFactorCode')?.setValue('123456')
      component.toggleRecoveryCode(new Event('click'))
      expect(hostComponent.form.get('twoFactorCode')?.value).toBeNull()
    })
  })

  describe('Backend Response Handling', () => {
    it('should apply backend error to password control', () => {
      component.processBackendResponse({ invalidPassword: true })

      const control = hostComponent.form.get('passwordControl')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should apply backend error to 2FA code', () => {
      component.processBackendResponse({ invalidTwoFactorCode: true })

      const control = hostComponent.form.get('twoFactorCode')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should apply backend error to Recovery code', () => {
      component.processBackendResponse({ invalidTwoFactorRecoveryCode: true })

      const control = hostComponent.form.get('twoFactorRecoveryCode')
      expect(control?.hasError('invalid')).toBeTrue()
    })

    it('should refocus input if response indicates success/continuation', fakeAsync(() => {
      component.processBackendResponse({
        twoFactorEnabled: true,
        invalidPassword: false,
        invalidTwoFactorCode: false,
        invalidTwoFactorRecoveryCode: false,
      })

      fixture.detectChanges()
      tick()

      const codeInputEl = fixture.debugElement.query(
        By.css('#twoFactorCode')
      ).nativeElement
      expect(document.activeElement).toBe(codeInputEl)
    }))
  })

  describe('Inputs (@Input)', () => {
    it('should display verification alert message if showAlert and showPasswordField are true', () => {
      hostComponent.showAlert = true
      hostComponent.showPasswordField = true
      fixture.detectChanges()

      // Robust query by Angular Directive rather than HTML tag
      const alert = fixture.debugElement.query(
        By.directive(AlertMessageComponent)
      )
      expect(alert).toBeTruthy()
      expect(alert.nativeElement.textContent).toContain(
        'Verify your ORCID account to continue'
      )
    })

    it('should display active 2FA alert message if showAlert is true but showPasswordField is false', () => {
      hostComponent.showAlert = true
      hostComponent.showPasswordField = false
      fixture.detectChanges()

      const alert = fixture.debugElement.query(
        By.directive(AlertMessageComponent)
      )
      expect(alert).toBeTruthy()
      expect(alert.nativeElement.textContent).toContain(
        'As two-factor authentication is currently active'
      )
    })

    it('should hide help text links if showHelpText is false', () => {
      hostComponent.showHelpText = false
      fixture.detectChanges()

      // Querying by data-testid instead of utility classes
      const links = fixture.debugElement.query(
        By.css('[data-testid="help-text-links"]')
      )
      expect(links).toBeFalsy()
    })

    it('should hide two-factor field if showTwoFactorField is false', () => {
      hostComponent.showTwoFactorField = false
      fixture.detectChanges()

      const codeInput = fixture.debugElement.query(By.css('#twoFactorCode'))
      expect(codeInput).toBeFalsy()
    })
  })
})
