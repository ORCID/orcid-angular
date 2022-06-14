import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ModalAffiliationsComponent } from './modal-affiliations.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { FormBuilder } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { SharedModule } from '../../../../../shared/shared.module'

describe('ModalAffiliationsComponent', () => {
  let component: ModalAffiliationsComponent
  let fixture: ComponentFixture<ModalAffiliationsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatAutocompleteModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [ModalAffiliationsComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        FormBuilder,
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
    fixture = TestBed.createComponent(ModalAffiliationsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
