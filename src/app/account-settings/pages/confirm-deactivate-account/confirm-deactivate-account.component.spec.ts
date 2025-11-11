import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { RouterTestingModule } from '@angular/router/testing'
import { of } from 'rxjs'
import { AccountActionsDeactivateService } from 'src/app/core/account-actions-deactivate/account-actions-deactivate.service'
import { DeactivationEndpoint } from 'src/app/types/common.endpoint'
import { ConfirmDeactivateAccountComponent } from './confirm-deactivate-account.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule } from '@angular/material/button'
import { By } from '@angular/platform-browser'

const mockDeactivationService = {
  deactivateAccount: jasmine
    .createSpy('deactivateAccount')
    .and.returnValue(of({})),
  verifyDeactivationToken: () => of({}),
}

const defaultMockActivatedRoute = {
  data: of({
    tokenVerification: {
      status: 'VALID',
      claims: { subject: '0000-0000-0000-0001' },
    },
  }),
  queryParamMap: of({
    get: (key: string) => (key === 'token' ? 'test-token-123' : null),
  }),
}

describe('ConfirmDeactivateAccountComponent', () => {
  let component: ConfirmDeactivateAccountComponent
  let fixture: ComponentFixture<ConfirmDeactivateAccountComponent>
  let service: AccountActionsDeactivateService

  async function setupTestBed(routeMock: any) {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDeactivateAccountComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: AccountActionsDeactivateService,
          useValue: mockDeactivationService,
        },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(ConfirmDeactivateAccountComponent)
    component = fixture.componentInstance
    service = TestBed.inject(AccountActionsDeactivateService)

    mockDeactivationService.deactivateAccount.calls.reset()

    fixture.detectChanges()
  }

  describe('with valid token', () => {
    beforeEach(async () => {
      await setupTestBed(defaultMockActivatedRoute)
    })

    it('should create and initialize from route data', () => {
      expect(component).toBeTruthy()
      expect(component.token).toBe('test-token-123')
      expect(component.tokenVerification?.status).toBe('VALID')

      const heading = fixture.debugElement.query(By.css('h1')).nativeElement
      expect(heading.textContent).toContain('Deactivate your ORCID account')
    })

    it('should not show 2FA fields on initial load', () => {
      const twoFactorInput = fixture.debugElement.query(
        By.css('#twoFactorCode')
      )
      expect(twoFactorInput).toBeFalsy()
    })

    it('should not submit if password is empty', () => {
      component.submit()
      expect(service.deactivateAccount).not.toHaveBeenCalled()
      expect(component.deactivationForm.get('password').touched).toBeTrue()
    })

    it('should call service on submit with just password (first step of 2FA flow)', () => {
      component.deactivationForm.get('password').setValue('test-password')
      const response: DeactivationEndpoint = { twoFactorEnabled: true }
      mockDeactivationService.deactivateAccount.and.returnValue(of(response))

      component.submit()
      fixture.detectChanges()

      expect(service.deactivateAccount).toHaveBeenCalledWith(
        {
          password: 'test-password',
          twoFactorCode: null,
          twoFactorRecoveryCode: null,
        },
        'test-token-123'
      )
      const twoFactorInput = fixture.debugElement.query(
        By.css('#twoFactorCode')
      )
      expect(twoFactorInput).toBeTruthy()
      expect(
        component.deactivationForm.get('twoFactorCode').hasError('required')
      ).toBeTrue()
    })

    it('should submit with 2FA code on second attempt', () => {
      component.data.twoFactorEnabled = true
      component['updateTwoFactorValidators']()
      fixture.detectChanges()

      component.deactivationForm.get('password').setValue('test-password')
      component.deactivationForm.get('twoFactorCode').setValue('123456')
      const successResponse: DeactivationEndpoint = {
        deactivationSuccessful: true,
      }
      mockDeactivationService.deactivateAccount.and.returnValue(
        of(successResponse)
      )

      component.submit()
      fixture.detectChanges()

      expect(service.deactivateAccount).toHaveBeenCalledWith(
        {
          password: 'test-password',
          twoFactorCode: '123456',
          twoFactorRecoveryCode: null,
        },
        'test-token-123'
      )
      const heading = fixture.debugElement.query(By.css('h1')).nativeElement
      expect(heading.textContent).toContain('account has been deactivated')
    })

    it('should toggle to and submit with recovery code', () => {
      component.data.twoFactorEnabled = true
      component['updateTwoFactorValidators']()
      fixture.detectChanges()

      component.toggleRecoveryCode(new Event('click'))
      fixture.detectChanges()

      expect(component.showRecoveryCode).toBeTrue()
      expect(
        fixture.debugElement.query(By.css('#twoFactorRecoveryCode'))
      ).toBeTruthy()
      expect(
        component.deactivationForm
          .get('twoFactorRecoveryCode')
          .hasError('required')
      ).toBeTrue()
      expect(
        component.deactivationForm.get('twoFactorCode').hasError('required')
      ).toBeFalse()

      component.deactivationForm.get('password').setValue('test-password')
      component.deactivationForm
        .get('twoFactorRecoveryCode')
        .setValue('1234567890')
      const successResponse: DeactivationEndpoint = {
        deactivationSuccessful: true,
      }
      mockDeactivationService.deactivateAccount.and.returnValue(
        of(successResponse)
      )

      component.submit()
      fixture.detectChanges()

      expect(service.deactivateAccount).toHaveBeenCalledWith(
        {
          password: 'test-password',
          twoFactorCode: null,
          twoFactorRecoveryCode: '1234567890',
        },
        'test-token-123'
      )
    })

    it('should show "Invalid sign in details" on invalidPassword response', () => {
      component.deactivationForm.get('password').setValue('wrong-password')
      const response: DeactivationEndpoint = { invalidPassword: true }
      mockDeactivationService.deactivateAccount.and.returnValue(of(response))

      component.submit()
      fixture.detectChanges()

      const alert = fixture.debugElement.query(By.css('app-alert-message'))
      expect(alert).toBeTruthy()
    })

    it('should show backend error for invalid 2FA code', () => {
      component.data.twoFactorEnabled = true
      component['updateTwoFactorValidators']()
      fixture.detectChanges()

      component.deactivationForm.get('password').setValue('test-password')
      component.deactivationForm.get('twoFactorCode').setValue('000000')
      const response: DeactivationEndpoint = { invalidTwoFactorCode: true }
      mockDeactivationService.deactivateAccount.and.returnValue(of(response))

      component.submit()
      fixture.detectChanges()

      expect(
        component.deactivationForm
          .get('twoFactorCode')
          .hasError('backendInvalid')
      ).toBeTrue()
    })

    it('should show backend error for invalid recovery code', () => {
      component.data.twoFactorEnabled = true
      component['updateTwoFactorValidators']()
      fixture.detectChanges()

      component.toggleRecoveryCode(new Event('click'))
      fixture.detectChanges()

      component.deactivationForm.get('password').setValue('test-password')
      component.deactivationForm
        .get('twoFactorRecoveryCode')
        .setValue('0000000000')
      const response: DeactivationEndpoint = {
        invalidTwoFactorRecoveryCode: true,
      }
      mockDeactivationService.deactivateAccount.and.returnValue(of(response))

      component.submit()
      fixture.detectChanges()

      expect(
        component.deactivationForm
          .get('twoFactorRecoveryCode')
          .hasError('backendInvalid')
      ).toBeTrue()
    })
  })

  it('should show token error: INVALID', async () => {
    const invalidRouteMock = {
      data: of({ tokenVerification: { status: 'INVALID' } }),
      queryParamMap: of({ get: () => null }),
    }
    await setupTestBed(invalidRouteMock)

    const heading = fixture.debugElement.query(By.css('h1')).nativeElement
    expect(heading.textContent).toContain('problem with your deactivation link')
  })

  it('should show token error: EXPIRED', async () => {
    const expiredRouteMock = {
      data: of({ tokenVerification: { status: 'EXPIRED' } }),
      queryParamMap: of({ get: () => null }),
    }
    await setupTestBed(expiredRouteMock)

    const heading = fixture.debugElement.query(By.css('h1')).nativeElement
    expect(heading.textContent).toContain('deactivation link has expired')
  })
})
