import { ComponentFixture, TestBed } from '@angular/core/testing'

import { Overlay } from '@angular/cdk/overlay'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { MdePopoverModule } from '../../../cdk/popover'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { RegisterService } from '../../../core/register/register.service'
import { FormCurrentEmploymentComponent } from './form-current-employment.component'
import {
  MatLegacyAutocomplete,
  MatLegacyAutocompleteModule,
} from '@angular/material/legacy-autocomplete'
import { SharedModule } from 'src/app/shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormPersonalComponent', () => {
  let component: FormCurrentEmploymentComponent
  let fixture: ComponentFixture<FormCurrentEmploymentComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MdePopoverModule,
        RouterTestingModule,
        MatLegacyAutocompleteModule,
        SharedModule,
      ],
      declarations: [FormCurrentEmploymentComponent],
      providers: [
        WINDOW_PROVIDERS,
        ReactivationService,
        RegisterService,
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
    fixture = TestBed.createComponent(FormCurrentEmploymentComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
