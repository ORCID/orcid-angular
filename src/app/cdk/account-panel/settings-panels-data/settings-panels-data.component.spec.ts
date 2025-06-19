import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsPanelsDataComponent } from './settings-panels-data.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('SettingsPanelsDataComponent', () => {
  let component: SettingsPanelsDataComponent
  let fixture: ComponentFixture<SettingsPanelsDataComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [SettingsPanelsDataComponent],
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
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPanelsDataComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
