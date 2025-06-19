import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResetPasswordComponent } from './reset-password.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { UntypedFormBuilder } from '@angular/forms'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RegisterService } from '../../core/register/register.service'
import { PasswordRecoveryService } from '../../core/password-recovery/password-recovery.service'
import { MdePopoverModule } from '../../cdk/popover'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent
  let fixture: ComponentFixture<ResetPasswordComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MdePopoverModule, RouterTestingModule],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  xit('should create', () => {
    expect(component).toBeTruthy()
  })
})
