import { TestBed } from '@angular/core/testing'

import { RecordFundingsService } from './record-fundings.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import {
  Funding,
  FundingGroup,
  FundingTypes,
} from '../../types/record-funding.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('FundingService', () => {
  beforeEach(() =>
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
  )

  it('should be created', () => {
    const service: RecordFundingsService = TestBed.get(RecordFundingsService)
    expect(service).toBeTruthy()
  })
})

export function getFundingGroup(): FundingGroup[] {
  return [
    {
      defaultFunding: getFunding(),
      fundings: [getFunding()],
      externalIdentifiers: [],
    },
  ] as FundingGroup[]
}

function getFunding(): Funding {
  return {
    fundingName: {
      value: 'Grant',
    },
    fundingTitle: { title: { value: 'funding' } },
    fundingType: {
      value: FundingTypes.grant,
    },
    putCode: {
      value: '1',
    },
    visibility: { visibility: 'PUBLIC' },
  } as Funding
}
