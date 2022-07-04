import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkStackGroupComponent } from './work-stack-group.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../core/record/record.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'

describe('WorkStackGroupComponent', () => {
  let component: WorkStackGroupComponent
  let fixture: ComponentFixture<WorkStackGroupComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [WorkStackGroupComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordService,
        RecordWorksService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStackGroupComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
