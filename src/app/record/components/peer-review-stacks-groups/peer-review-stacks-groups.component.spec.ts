import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PeerReviewStacksGroupsComponent } from './peer-review-stacks-groups.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { CookieService } from 'ngx-cookie-service'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { UserService } from '../../../core'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RecordService } from '../../../core/record/record.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'

describe('PeerReviewStacksGroupsComponent', () => {
  let component: PeerReviewStacksGroupsComponent
  let fixture: ComponentFixture<PeerReviewStacksGroupsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [PeerReviewStacksGroupsComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        RecordService,
        RecordPeerReviewService,
        TogglzService,
        UserService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
      ],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PeerReviewStacksGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
