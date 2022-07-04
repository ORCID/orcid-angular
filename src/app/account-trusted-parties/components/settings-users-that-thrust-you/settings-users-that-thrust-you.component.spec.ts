import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsUsersThatThrustYouComponent } from './settings-users-that-thrust-you.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

describe('SettingsUsersThatThrustYouComponent', () => {
  let component: SettingsUsersThatThrustYouComponent
  let fixture: ComponentFixture<SettingsUsersThatThrustYouComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsUsersThatThrustYouComponent],
      providers: [
        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(SettingsUsersThatThrustYouComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
