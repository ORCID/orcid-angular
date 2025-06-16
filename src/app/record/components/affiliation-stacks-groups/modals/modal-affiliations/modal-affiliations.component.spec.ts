import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalAffiliationsComponent } from './modal-affiliations.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MatLegacyMenuModule,
  MatLegacyMenu as MatMenu,
} from '@angular/material/legacy-menu'

import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms'
import { MatAutocompleteModule as MatAutocompleteModule } from '@angular/material/autocomplete'
import { SharedModule } from '../../../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { MatOption } from '@angular/material/core'
import { MatLegacySelectModule } from '@angular/material/legacy-select'
import { VisibilitySelectorComponent } from 'src/app/cdk/visibility-selector/visibility-selector/visibility-selector.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacyInputModule } from '@angular/material/legacy-input'

describe('ModalAffiliationsComponent', () => {
  let component: ModalAffiliationsComponent
  let fixture: ComponentFixture<ModalAffiliationsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        RouterTestingModule,
        SharedModule,
        MatLegacySelectModule,
        MatLegacyMenuModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatLegacyFormFieldModule,
        MatLegacyInputModule,
      ],
      declarations: [ModalAffiliationsComponent, VisibilitySelectorComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        MatMenu,
        MatOption,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAffiliationsComponent)
    component = fixture.componentInstance

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
