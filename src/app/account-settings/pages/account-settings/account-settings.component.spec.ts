import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AccountSettingsComponent } from './account-settings.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { UserService } from '../../../core'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'

describe('AccountSettingsComponent', () => {
  let component: AccountSettingsComponent
  let fixture: ComponentFixture<AccountSettingsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AccountSettingsComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        UserService,
        TogglzService,
        UserService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
