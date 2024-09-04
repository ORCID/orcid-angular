import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FormPersonalComponent } from './form-personal.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { FormBuilder } from '@angular/forms'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RegisterService } from '../../../core/register/register.service'
import { ReactivationService } from '../../../core/reactivation/reactivation.service'
import { MdePopoverModule } from '../../../cdk/popover'
import { MatLegacyAutocomplete } from '@angular/material/legacy-autocomplete'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FormPersonalComponent', () => {
  let component: FormPersonalComponent
  let fixture: ComponentFixture<FormPersonalComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MdePopoverModule, RouterTestingModule],
      declarations: [FormPersonalComponent],
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
    fixture = TestBed.createComponent(FormPersonalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
