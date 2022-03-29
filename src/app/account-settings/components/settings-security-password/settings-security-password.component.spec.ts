import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityPasswordComponent } from './settings-security-password.component'
import { FormBuilder } from '@angular/forms'
import { RegisterService } from '../../../core/register/register.service'
import { AccountSecurityPasswordService } from '../../../core/account-security-password/account-security-password.service'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

describe('SettingsSecurityPasswordComponent', () => {
  let component: SettingsSecurityPasswordComponent
  let fixture: ComponentFixture<SettingsSecurityPasswordComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [SettingsSecurityPasswordComponent],
      providers: [
        WINDOW_PROVIDERS,
        FormBuilder,
        RegisterService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
        AccountSecurityPasswordService,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsSecurityPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
