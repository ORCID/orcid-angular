import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { SettingsPanelsComponent } from './settings-panels.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsPanelsComponent', () => {
  let component: SettingsPanelsComponent
  let fixture: ComponentFixture<SettingsPanelsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsPanelsComponent],
      providers: [
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
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
