import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelComponent } from './panel.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../window'
import { PlatformInfoService } from '../../platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserService } from '../../../core'
import { RecordAffiliationService } from '../../../core/record-affiliations/record-affiliations.service'
import { RecordFundingsService } from '../../../core/record-fundings/record-fundings.service'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'
import { RecordResearchResourceService } from '../../../core/record-research-resource/record-research-resource.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { VerificationEmailModalService } from '../../../core/verification-email-modal/verification-email-modal.service'
import { EditButtonAriaLabelPipe } from '../../../shared/pipes/edit-button-aria-label/edit-button-aria-label.pipe'

describe('PanelComponent', () => {
  let component: PanelComponent
  let fixture: ComponentFixture<PanelComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [PanelComponent,EditButtonAriaLabelPipe,],
      providers: [
        WINDOW_PROVIDERS,
        UserService,
        RecordAffiliationService,
        RecordFundingsService,
        RecordPeerReviewService,
        RecordResearchResourceService,
        RecordWorksService,
        VerificationEmailModalService,
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
    fixture = TestBed.createComponent(PanelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
