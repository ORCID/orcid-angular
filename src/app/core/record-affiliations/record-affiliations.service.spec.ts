import { TestBed } from '@angular/core/testing'

import { RecordAffiliationService } from './record-affiliations.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RecordAffiliationsGroupingService } from '../record-affiliations-affiliations-grouping/record-affiliations-grouping.service'
import { AffiliationsSortService } from '..'
import {
  Affiliation,
  AffiliationGroup,
  AffiliationGroupsTypes,
  AffiliationType,
  AffiliationUIGroup,
} from '../../types/record-affiliation.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AffiliationsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        WINDOW_PROVIDERS,
        AffiliationsSortService,
        RecordAffiliationsGroupingService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
    })
  )

  it('should be created', () => {
    const service: RecordAffiliationService = TestBed.get(
      RecordAffiliationService
    )
    expect(service).toBeTruthy()
  })
})

export function getAffiliationUIGroup(): AffiliationUIGroup[] {
  return [
    {
      type: AffiliationGroupsTypes.EMPLOYMENT,
      affiliationGroup: [getAffiliationGroup(AffiliationType.employment)],
    },
    {
      type: AffiliationGroupsTypes.MEMBERSHIP,
      affiliationGroup: [getAffiliationGroup(AffiliationType.membership)],
    },
  ]
}

function getAffiliationGroup(
  affiliationType: AffiliationType
): AffiliationGroup {
  return {
    externalIdentifiers: [],
    affiliations: [getAffiliation(affiliationType)],
    defaultAffiliation: getAffiliation(affiliationType),
  } as AffiliationGroup
}

function getAffiliation(affiliationType: AffiliationType): Affiliation {
  return {
    affiliationName: { value: 'ORCID' },
    affiliationType: { value: affiliationType },
    putCode: { value: '1' },
    visibility: { visibility: 'PUBLIC' },
    city: { value: 'city' },
    region: { value: 'region' },
    country: { value: 'country' },
  } as Affiliation
}
