import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from './cdk/window'
import { FormBuilder } from '@angular/forms'
import { RecordWorksService } from './core/record-works/record-works.service'
import { PlatformInfoService } from './cdk/platform-info'
import { ErrorHandlerService } from './core/error-handler/error-handler.service'
import { SnackbarService } from './cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { TitleService } from './core/title-service/title.service'
import { of } from 'rxjs'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        {
          provide: TitleService,
          useValue: {
            init: () => of({}),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  })
})
