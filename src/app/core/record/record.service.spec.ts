import { TestBed } from '@angular/core/testing'

import { RecordService } from './record.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { UserRecord } from '../../types/record.local'
import { getAffiliationUIGroup } from '../record-affiliations/record-affiliations.service.spec'
import { getWorksEndpoint } from '../record-works/record-works.service.spec'
import { getFundingGroup } from '../record-fundings/record-fundings.service.spec'
import { getResearchResourcesEndpoint } from '../record-research-resource/record-research-resource.service.spec'
import { getNamesEndPoint } from '../record-names/record-names.service.spec'
import { getBiographyEndPoint } from '../record-biography/record-biography.service.spec'
import { getUserInfo } from '../user-info/user-info.service.spec'
import { getPeerReviews } from '../record-peer-review/record-peer-review.service.spec'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordService', () => {
  let service: RecordService

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
    service = TestBed.inject(RecordService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getUserRecord(): UserRecord {
  const userRecord: UserRecord = {} as UserRecord
  userRecord.userInfo = getUserInfo()
  userRecord.names = getNamesEndPoint()
  userRecord.biography = getBiographyEndPoint()
  userRecord.affiliations = getAffiliationUIGroup()
  userRecord.works = getWorksEndpoint()
  userRecord.fundings = getFundingGroup()
  userRecord.peerReviews = getPeerReviews()
  userRecord.researchResources = getResearchResourcesEndpoint()
  return userRecord
}
