import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LanguageComponent } from './language.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { LanguageService } from '../../core/language/language.service'
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('LanguageComponent', () => {
  let component: LanguageComponent
  let fixture: ComponentFixture<LanguageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatMenuModule, RouterTestingModule],
      declarations: [LanguageComponent],
      providers: [
        WINDOW_PROVIDERS,
        LanguageService,
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
    fixture = TestBed.createComponent(LanguageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
