import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { AffiliationStacksGroupsComponent } from './affiliation-stacks-groups.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../core/record/record.service'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'

describe('AffiliationStacksGroupsComponent', () => {
  let component: AffiliationStacksGroupsComponent
  let fixture: ComponentFixture<AffiliationStacksGroupsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AffiliationStacksGroupsComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordService,
        RecordAffiliationService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AffiliationStacksGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
