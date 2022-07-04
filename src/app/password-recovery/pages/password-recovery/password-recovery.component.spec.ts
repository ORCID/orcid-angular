import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PasswordRecoveryComponent } from './password-recovery.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { PasswordRecoveryService } from '../../../core/password-recovery/password-recovery.service'
import { MatChipsModule } from '@angular/material/chips'

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent
  let fixture: ComponentFixture<PasswordRecoveryComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatChipsModule, RouterTestingModule],
      declarations: [PasswordRecoveryComponent],
      providers: [
        WINDOW_PROVIDERS,
        PasswordRecoveryService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRecoveryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
