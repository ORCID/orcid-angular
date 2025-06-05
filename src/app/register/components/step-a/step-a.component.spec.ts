import { ComponentFixture, TestBed } from '@angular/core/testing'

import { StepAComponent } from './step-a.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms'
import { BaseStepDirective } from '../BaseStep'
import { MdePopover, MdePopoverTrigger } from 'src/app/cdk/popover'
import { FormPersonalComponent } from 'src/app/register2/components/form-personal/form-personal.component'

describe('StepAComponent', () => {
  let component: StepAComponent
  let fixture: ComponentFixture<StepAComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [
        StepAComponent,
        FormPersonalComponent,
        MdePopoverTrigger,
        MdePopover,
      ],
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
    fixture = TestBed.createComponent(StepAComponent)
    component = fixture.componentInstance
    component.formGroup = new UntypedFormGroup({
      personal: new UntypedFormControl(''),
    })
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
