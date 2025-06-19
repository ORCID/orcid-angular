import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkExternalIdModalComponent } from './work-external-id-modal.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import {
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WorkDoiModalComponent', () => {
  let component: WorkExternalIdModalComponent
  let fixture: ComponentFixture<WorkExternalIdModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [WorkExternalIdModalComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        RecordWorksService,
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
    fixture = TestBed.createComponent(WorkExternalIdModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
