import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsSecurityPasswordComponent } from './settings-security-password.component'
import { FormBuilder } from '@angular/forms'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'

describe('SettingsSecurityPasswordComponent', () => {
  let component: SettingsSecurityPasswordComponent
  let fixture: ComponentFixture<SettingsSecurityPasswordComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [SettingsSecurityPasswordComponent],
      providers: [
        WINDOW_PROVIDERS,
        FormBuilder,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay
      ]
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
