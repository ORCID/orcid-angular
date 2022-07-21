import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SettingsActionsDuplicatedComponent } from './settings-actions-duplicated.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { AccountActionsDuplicatedService } from '../../../core/account-actions-duplicated/account-actions-duplicated.service'

describe('SettingsActionsDuplicatedComponent', () => {
  let component: SettingsActionsDuplicatedComponent
  let fixture: ComponentFixture<SettingsActionsDuplicatedComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [SettingsActionsDuplicatedComponent],
      providers: [
        WINDOW_PROVIDERS,
        FormBuilder,
        AccountActionsDuplicatedService,
        UserService,
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
    fixture = TestBed.createComponent(SettingsActionsDuplicatedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
