import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormNotificationsComponent } from './form-notifications.component'
import { RegisterService } from '../../../core/register/register.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { WINDOW_PROVIDERS } from '../../../cdk/window'

describe('FormNotificationsComponent', () => {
  let component: FormNotificationsComponent
  let fixture: ComponentFixture<FormNotificationsComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [FormNotificationsComponent],
      providers: [
        WINDOW_PROVIDERS,
        RegisterService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNotificationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
