import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { ModalWebsitesComponent } from './modal-websites.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../window'
import { PlatformInfoService } from '../../../platform-info'
import { ErrorHandlerService } from '../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../../core'
import { RecordWebsitesService } from '../../../../core/record-websites/record-websites.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms'

describe('ModalWebsitesComponent', () => {
  let component: ModalWebsitesComponent
  let fixture: ComponentFixture<ModalWebsitesComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [ModalWebsitesComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UserService,
        RecordWebsitesService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalWebsitesComponent)
    component = fixture.componentInstance
    component.websitesForm = new UntypedFormGroup({})
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
