import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../../../cdk/window'
import { PlatformInfoService } from '../../../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordWorksService } from '../../../../../core/record-works/record-works.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ExpandedWorkFeaturedModalComponent } from './expanded-work-featured-modal.component'
import { ReactiveFormsModule } from '@angular/forms'
import { MonthDayYearDateToStringPipe } from 'src/app/shared/pipes/month-day-year-date-to-string/month-day-year-date-to-string.pipe'
import { RecordWorkTypeLabelPipe } from 'src/app/shared/pipes/record-work-type-label/record-work-type-label.pipe'
import { RecordHolderRolesPipe } from 'src/app/shared/pipes/record-holder-roles/record-holder-roles.pipe'

describe('ExpandedWorkFeaturedModalComponent', () => {
  let component: ExpandedWorkFeaturedModalComponent
  let fixture: ComponentFixture<ExpandedWorkFeaturedModalComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [
        ExpandedWorkFeaturedModalComponent,
        MonthDayYearDateToStringPipe,
        RecordWorkTypeLabelPipe,
        RecordHolderRolesPipe,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
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
    fixture = TestBed.createComponent(ExpandedWorkFeaturedModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
