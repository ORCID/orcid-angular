import { TestBed } from '@angular/core/testing'

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordPeerReviewService } from './record-peer-review.service'
import {
  PeerReview,
  PeerReviewDuplicateGroup,
} from '../../types/record-peer-review.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordPeerReviewService', () => {
  let service: RecordPeerReviewService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
    service = TestBed.inject(RecordPeerReviewService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getPeerReviews(): PeerReview[] {
  return [
    {
      name: 'Name',
      visibility: 'PUBLIC',
      peerReviewDuplicateGroups: [
        {
          activePutCode: 1,
          id: 1,
          peerReviews: [
            {
              name: 'Name',
              visibility: 'PUBLIC',
            },
          ] as PeerReview[],
        },
      ] as PeerReviewDuplicateGroup[],
    } as PeerReview,
  ]
}
