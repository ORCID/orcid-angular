import { TestBed } from '@angular/core/testing'

import { RecordResearchResourceService } from './record-research-resource.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import {
  Host,
  ResearchResource,
  ResearchResourcesEndpoint,
  ResearchResourcesGroup,
} from '../../types/record-research-resources.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('RecordResearchResourceService', () => {
  let service: RecordResearchResourceService

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
    service = TestBed.inject(RecordResearchResourceService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

export function getResearchResourcesEndpoint(): ResearchResourcesEndpoint {
  return {
    groups: [getResearchResourcesGroup()],
  } as ResearchResourcesEndpoint
}

export function getResearchResourcesGroup(): ResearchResourcesGroup {
  return {
    activePutCode: 1,
    defaultResearchResource: getResearchResource(),
    researchResources: [getResearchResource()],
    activeVisibility: 'PUBLIC',
  } as ResearchResourcesGroup
}

export function getResearchResource(): ResearchResource {
  return {
    hosts: [
      {
        name: '',
        orgDisambiguatedId: '',
        disambiguationSource: '',
      } as Host,
    ],
  } as ResearchResource
}
