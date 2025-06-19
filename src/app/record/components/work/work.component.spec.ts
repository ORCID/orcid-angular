import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkComponent } from './work.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserInfoService } from '../../../core/user-info/user-info.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { SharedModule } from '../../../shared/shared.module'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WorkComponent', () => {
  let component: WorkComponent
  let fixture: ComponentFixture<WorkComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [WorkComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserInfoService,
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
    fixture = TestBed.createComponent(WorkComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
