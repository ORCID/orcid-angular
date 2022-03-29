import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TwoFactorComponent } from './two-factor.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { TwoFactorAuthenticationService } from '../../../core/two-factor-authentication/two-factor-authentication.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MdePopoverModule } from '../../../cdk/popover'

describe('TwoFactorComponent', () => {
  let component: TwoFactorComponent
  let fixture: ComponentFixture<TwoFactorComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MdePopoverModule, RouterTestingModule, HttpClientTestingModule],
      declarations: [TwoFactorComponent],
      providers: [
        WINDOW_PROVIDERS,
        TwoFactorAuthenticationService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoFactorComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
