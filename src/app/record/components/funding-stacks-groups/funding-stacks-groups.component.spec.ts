import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { FundingStacksGroupsComponent } from './funding-stacks-groups.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { RecordService } from '../../../core/record/record.service'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordCountriesService } from '../../../core/record-countries/record-countries.service'

describe('FundingStacksGroupsComponent', () => {
  let component: FundingStacksGroupsComponent
  let fixture: ComponentFixture<FundingStacksGroupsComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FundingStacksGroupsComponent],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        RecordService,
        RecordFundingsService,
        RecordCountriesService,
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
    fixture = TestBed.createComponent(FundingStacksGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
