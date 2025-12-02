import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityAlternateSignInComponent } from './settings-security-alternate-sign-in.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { AccountSecurityAlternateSignInService } from '../../../core/account-security-alternate-sign-in/account-security-alternate-sign-in.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsSecurityAlternateSignInComponent', () => {
  let component: SettingsSecurityAlternateSignInComponent
  let fixture: ComponentFixture<SettingsSecurityAlternateSignInComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsSecurityAlternateSignInComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountSecurityAlternateSignInService,
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
    fixture = TestBed.createComponent(SettingsSecurityAlternateSignInComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
