import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeactivatedComponent } from './deactivated.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../cdk/window'
import { PlatformInfoService } from '../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SignInService } from '../../../../core/sign-in/sign-in.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'

describe('DeactivatedComponent', () => {
  let component: DeactivatedComponent
  let fixture: ComponentFixture<DeactivatedComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [DeactivatedComponent],
      providers: [
        WINDOW_PROVIDERS,
        SignInService,
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
    fixture = TestBed.createComponent(DeactivatedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
