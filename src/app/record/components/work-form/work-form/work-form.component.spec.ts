import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkFormComponent } from './work-form.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../cdk/window'
import { PlatformInfoService } from '../../../../cdk/platform-info'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { SnackbarService } from '../../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../../core/record/record.service'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms'
import { SharedModule } from '../../../../shared/shared.module'
import { getWork } from '../../../../core/record-works/record-works.service.spec'
import { getContributor } from '../../work-contributors/work-contributors.component.spec'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select'
import { RecordModule } from '../../../record.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WorkFormComponent', () => {
  let component: WorkFormComponent
  let fixture: ComponentFixture<WorkFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatSelectModule,
        ReactiveFormsModule,
        RecordModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [WorkFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        UntypedFormBuilder,
        PlatformInfoService,
        RecordService,
        RecordWorksService,
        RecordCountriesService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
