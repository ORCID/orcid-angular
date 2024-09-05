import { TestBed } from '@angular/core/testing'

import { RecordPublicSideBarService } from './record-public-side-bar.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { Overlay } from '@angular/cdk/overlay'
import { SideBarPublicUserRecord } from '../../types/record.local'
import { BiographyEndPoint } from '../../types/record-biography.endpoint'
import { OtherNamesEndPoint } from '../../types/record-other-names.endpoint'
import {
  CountriesEndpoint,
  EmailsEndpoint,
  PersonIdentifierEndpoint,
} from '../../types'
import { KeywordEndPoint } from '../../types/record-keyword.endpoint'
import { WebsitesEndPoint } from '../../types/record-websites.endpoint'
import { getNamesEndPoint } from '../record-names/record-names.service.spec'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordPublicSideBarService', () => {
  let service: RecordPublicSideBarService

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
    service = TestBed.inject(RecordPublicSideBarService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getSideBarPublicUserRecord(): SideBarPublicUserRecord {
  return {
    displayName: null,
    names: 'name',
    biography: null,
    otherNames: null,
    countries: null,
    keyword: null,
    emails: null,
    externalIdentifier: null,
    website: null,
  } as SideBarPublicUserRecord
}
