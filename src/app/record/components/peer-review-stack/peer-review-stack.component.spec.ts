import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PeerReviewStackComponent } from './peer-review-stack.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordPeerReviewService } from '../../../core/record-peer-review/record-peer-review.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PeerReviewStackComponent', () => {
  let component: PeerReviewStackComponent
  let fixture: ComponentFixture<PeerReviewStackComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [PeerReviewStackComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordPeerReviewService,
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
    fixture = TestBed.createComponent(PeerReviewStackComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
