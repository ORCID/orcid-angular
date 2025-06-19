import { ComponentFixture, TestBed } from '@angular/core/testing'

import { NewsComponent } from './news.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { NewsService } from '../../../core'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('NewsComponent', () => {
  let component: NewsComponent
  let fixture: ComponentFixture<NewsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [NewsComponent],
      providers: [
        WINDOW_PROVIDERS,
        NewsService,
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
    fixture = TestBed.createComponent(NewsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
