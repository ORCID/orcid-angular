import { ComponentFixture, TestBed } from '@angular/core/testing'
import { TwoFactorSetupComponent } from './two-factor-setup.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { RouterTestingModule } from '@angular/router/testing'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core'
import { By } from '@angular/platform-browser'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('Component: TwoFactorSetupComponent', () => {
  let component: TwoFactorSetupComponent
  let compiled: any
  let fixture: ComponentFixture<TwoFactorSetupComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [TwoFactorSetupComponent],
      providers: [
        WINDOW_PROVIDERS,
        TwoFactorAuthenticationService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorSetupComponent)
    component = fixture.componentInstance
    compiled = fixture.debugElement.nativeElement
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should create the compiled', () => {
    expect(compiled.querySelector('h2').textContent).toContain(
      'Enable two-factor authentication (2FA)'
    )
  })

  it('should render TwoFactorEnableComponent', () => {
    const counter = findComponent(fixture, 'app-two-factor-enable')
    expect(counter).toBeTruthy()
  })

  it('should render TwoFactorRecoveryCodesComponent once the 2FA is enabled', () => {
    component.showBackupCodes = true
    fixture.detectChanges()
    const counter = findComponent(fixture, 'app-two-factor-recovery-codes')
    expect(counter).toBeTruthy()
  })
})

export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string
): DebugElement {
  return fixture.debugElement.query(By.css(selector))
}
