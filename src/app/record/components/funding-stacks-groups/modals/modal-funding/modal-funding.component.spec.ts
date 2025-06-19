import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalFundingComponent } from './modal-funding.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import {
  Form,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { UserService } from '../../../../../core'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete'
import { SharedModule } from '../../../../../shared/shared.module'
import { ModalModule } from '../../../../../cdk/modal/modal.module'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { By } from '@angular/platform-browser'
import { RecordModule } from '../../../../record.module'
import { FundingTypes } from '../../../../../types/record-funding.endpoint'
import { VisibilitySelectorModule } from 'src/app/cdk/visibility-selector/visibility-selector.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ModalFundingComponent', () => {
  let component: ModalFundingComponent
  let fixture: ComponentFixture<ModalFundingComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        ModalModule,
        NoopAnimationsModule,
        VisibilitySelectorModule,
        ReactiveFormsModule,
        RecordModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [ModalFundingComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
        PlatformInfoService,
        UserService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFundingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should add an external identifier and be valid', async () => {
    component.fundingForm.get('fundingType').setValue(FundingTypes.grant)
    component.fundingForm.get('fundingProjectTitle').setValue('Non profit')
    component.fundingForm.get('agencyName').setValue('University of Oxford')
    component.fundingForm.get('city').setValue('Oxford')
    component.fundingForm.get('country').setValue('United Kingdom')
    component.fundingForm.get('visibility').setValue('PUBLIC')

    component.fundingForm.updateValueAndValidity()

    fixture.detectChanges()

    const addExternalIdentifierButton = fixture.debugElement.query(
      By.css('#add-link')
    )
    await addExternalIdentifierButton.nativeElement.click()

    await fixture.whenStable()

    const grantsArray = component.fundingForm.controls
      .grants as UntypedFormArray
    const grant = grantsArray.controls[0] as UntypedFormGroup
    grant.get('grantNumber').setValue('1234')

    fixture.detectChanges()

    expect(component.fundingForm.valid).toBe(true)
  })
})
