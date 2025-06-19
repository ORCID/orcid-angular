import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SnackbarComponent } from './snackbar.component'
import { MatDialog } from '@angular/material/dialog'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../snackbar.service'
import {
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
  MatLegacySnackBar as MatSnackBar,
  MatLegacySnackBarRef as MatSnackBarRef,
} from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SnackbarComponent', () => {
  let component: SnackbarComponent
  let fixture: ComponentFixture<SnackbarComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SnackbarComponent],
      providers: [
        { provide: MatSnackBarRef, useValue: {} },
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(SnackbarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
