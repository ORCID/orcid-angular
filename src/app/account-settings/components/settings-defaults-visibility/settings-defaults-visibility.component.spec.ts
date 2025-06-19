import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsVisibilityComponent } from './settings-defaults-visibility.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { RecordService } from '../../../core/record/record.service'
import { UntypedFormBuilder } from '@angular/forms'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { RegisterService } from '../../../core/register/register.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { AccountDefaultVisibilityService } from '../../../core/account-default-visibility/account-default-visibility.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsDefaultsVisibilityComponent', () => {
  let component: SettingsDefaultsVisibilityComponent
  let fixture: ComponentFixture<SettingsDefaultsVisibilityComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SettingsDefaultsVisibilityComponent],
      providers: [
        WINDOW_PROVIDERS,
        AccountDefaultVisibilityService,
        UntypedFormBuilder,
        RecordService,
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
    fixture = TestBed.createComponent(SettingsDefaultsVisibilityComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
