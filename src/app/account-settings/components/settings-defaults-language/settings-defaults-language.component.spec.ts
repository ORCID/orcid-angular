import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsDefaultsLanguageComponent } from './settings-defaults-language.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { LanguageService } from '../../../core/language/language.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'

describe('SettingsDefaultsLanguageComponent', () => {
  let component: SettingsDefaultsLanguageComponent
  let fixture: ComponentFixture<SettingsDefaultsLanguageComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SettingsDefaultsLanguageComponent],
      providers: [
        WINDOW_PROVIDERS,
        FormBuilder,
        LanguageService,
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
    fixture = TestBed.createComponent(SettingsDefaultsLanguageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
