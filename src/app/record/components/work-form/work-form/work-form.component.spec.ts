import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkFormComponent } from './work-form.component'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../../cdk/window'
import { PlatformInfoService } from '../../../../cdk/platform-info'
import { RecordWorksService } from '../../../../core/record-works/record-works.service'
import { SnackbarService } from '../../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../../core/record/record.service'
import { RecordCountriesService } from '../../../../core/record-countries/record-countries.service'
import { FormBuilder } from '@angular/forms'
import { SharedModule } from '../../../../shared/shared.module'

describe('WorkFormComponent', () => {
  let component: WorkFormComponent
  let fixture: ComponentFixture<WorkFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [WorkFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        WINDOW_PROVIDERS,
        FormBuilder,
        PlatformInfoService,
        RecordService,
        RecordWorksService,
        RecordCountriesService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
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
