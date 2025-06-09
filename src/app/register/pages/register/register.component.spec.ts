import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RegisterComponent } from './register.component'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { UntypedFormBuilder } from '@angular/forms'
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog'
import { RegisterService } from '../../../core/register/register.service'
import { UserService } from '../../../core'
import { SearchService } from '../../../core/search/search.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RegisterComponent', () => {
  let component: RegisterComponent
  let fixture: ComponentFixture<RegisterComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [RegisterComponent],
      providers: [
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        RegisterService,
        SearchService,
        UserService,
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
    fixture = TestBed.createComponent(RegisterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
