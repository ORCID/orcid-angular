import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TwoFactorEnableComponent } from './two-factor-enable.component'
import { RouterTestingModule } from '@angular/router/testing'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'

describe('TwoFactorEnableComponent', () => {
  let component: TwoFactorEnableComponent
  let fixture: ComponentFixture<TwoFactorEnableComponent>
  let fakeTwoFactorAuthenticationService: TwoFactorAuthenticationService
  let debugElement: DebugElement

  beforeEach(async () => {
    fakeTwoFactorAuthenticationService =
      jasmine.createSpyObj<TwoFactorAuthenticationService>(
        'TwoFactorAuthenticationService',
        {
          getTextCode: of({ secret: '123456' }),
          register: undefined,
        }
      )

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatInputModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      declarations: [TwoFactorEnableComponent],
      providers: [
        WINDOW_PROVIDERS,
        {
          provide: TwoFactorAuthenticationService,
          useValue: fakeTwoFactorAuthenticationService,
        },
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorEnableComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should include a qr code image', () => {
    expect(
      debugElement.nativeElement.querySelector('img').textContent
    ).not.toBeNull()
  })

  it('should display a textarea with a text code', () => {
    expect(
      debugElement.nativeElement.querySelector('[data-cy="textCode"]')
    ).toBeNull()
    const textCodeLink = debugElement.query(By.css('#cy-text-code'))
    textCodeLink.triggerEventHandler('click', null)
    expect(fakeTwoFactorAuthenticationService.getTextCode).toHaveBeenCalled()
    component.showTextCode = true
    fixture.detectChanges()
    expect(
      debugElement.nativeElement.querySelector('[data-cy="textCode"]')
        .textContent
    ).not.toBeNull()
  })

  it('should call register method when input is filled button has been press', async () => {
    component.twoFactorForm.get('verificationCode').setValue('123456')

    fixture.detectChanges()
    await fixture.whenStable()

    const twoFactorButton = debugElement.query(By.css('#cy-continue'))
    twoFactorButton.nativeElement.click()

    fixture.detectChanges()

    expect(fakeTwoFactorAuthenticationService.register).toHaveBeenCalled()
  })
})
