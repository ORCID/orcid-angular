import { TestBed } from '@angular/core/testing'

import { RecordWorksService } from './record-works.service'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import {
  Work,
  WorkGroup,
  WorksEndpoint,
} from '../../types/record-works.endpoint'
import { TogglzService } from '../togglz/togglz.service'
import { of, ReplaySubject } from 'rxjs'
import { UserService } from '..'
import { Config } from 'src/app/types/config.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

declare const runtimeEnvironment: { API_WEB: string }

describe('RecordWorksService', () => {
  let service: RecordWorksService
  let togglzService: TogglzService
  let httpTestingController: HttpTestingController
  let fakeTogglzService: TogglzService

  beforeEach(() => {
    fakeTogglzService = jasmine.createSpyObj<TogglzService>('TogglzService', {
      getStateOf: of(true),
    })

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        UserService,
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        { provide: TogglzService, useValue: fakeTogglzService },
      ],
    })
    service = TestBed.inject(RecordWorksService)
    togglzService = TestBed.inject(TogglzService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should call the method `save` 5 times and only `getWorks` and `getWorksGroupingSuggestions` once', () => {
    const works: Work[] = getNumberOfWorks(5)

    works.forEach((work, index) => {
      service
        .save(work, false, index === works.length - 1)
        .subscribe((workSaved) => {
          expect(workSaved).toBeTruthy()
        })
    })

    // Assert all 5 save requests were made
    const requestsSaveWorks = httpTestingController.match(
      runtimeEnvironment.API_WEB + 'works/work.json'
    )
    expect(requestsSaveWorks.length).toEqual(5)

    // Flush the save requests
    requestsSaveWorks.forEach((r) => r.flush({}))

    // Now getWorks should have been called once
    const requestGetWorks = httpTestingController.match(
      runtimeEnvironment.API_WEB +
        'works/worksExtendedPage.json?offset=0&sort=date&sortAsc=false&pageSize=50'
    )
    expect(requestGetWorks.length).toEqual(1)
    requestGetWorks.forEach((getWorks) => getWorks.flush({}))

    // Now groupingSuggestions should have been called once
    const requestGroupingSuggestions = httpTestingController.match(
      runtimeEnvironment.API_WEB + 'works/groupingSuggestions.json'
    )
    expect(requestGroupingSuggestions.length).toEqual(1)
    requestGroupingSuggestions.forEach((grouping) => grouping.flush({}))
  })

  describe('getImportWorksDialogDataSkeleton', () => {
    it('returns dialog data with loading true and empty link lists', () => {
      const skeleton = service.getImportWorksDialogDataSkeleton()
      expect(skeleton.loading).toBe(true)
      expect(skeleton.certifiedLinks).toEqual([])
      expect(skeleton.moreServicesLinks).toEqual([])
      expect(skeleton.title).toBeDefined()
      expect(skeleton.introText).toBeDefined()
      expect(skeleton.supportLink).toBeDefined()
      expect(skeleton.certifiedSectionHeading).toBeDefined()
      expect(skeleton.moreServicesHeading).toBeDefined()
      expect(skeleton.connectNowLabel).toBeDefined()
      expect(skeleton.connectedLabel).toBeDefined()
    })
  })

  describe('loadSearchAndLinkWizardDialogData', () => {
    it('requests retrieve-works-search-and-link-wizard.json and returns mapped dialog data', (done) => {
      const listPayload = [
        {
          id: 'cert-1',
          name: 'Certified Service',
          redirectUri: 'https://app.example/cb',
          scopes: '/read-limited',
          redirectUriMetadata: {
            type: 'Certified',
            defaultDescription: 'Cert desc',
          },
        },
        {
          id: 'more-1',
          name: 'More Service',
          description: 'More desc',
          redirectUri: 'https://app.example/cb2',
          scopes: '/activities/update',
        },
      ]

      service.loadSearchAndLinkWizardDialogData('en').subscribe((data) => {
        expect(data.loading).toBe(false)
        expect(data.certifiedLinks.length).toBe(1)
        expect(data.certifiedLinks[0].name).toBe('Certified Service')
        expect(data.certifiedLinks[0].description).toBe('Cert desc')
        expect(data.moreServicesLinks.length).toBe(1)
        expect(data.moreServicesLinks[0].name).toBe('More Service')
        expect(data.moreServicesLinks[0].description).toBe('More desc')
        done()
      })

      const req = httpTestingController.expectOne(
        runtimeEnvironment.API_WEB +
          'workspace/retrieve-works-search-and-link-wizard.json'
      )
      expect(req.request.method).toBe('GET')
      req.flush(listPayload)
    })

    it('returns empty certified and more lists when API returns empty array', (done) => {
      service.loadSearchAndLinkWizardDialogData('en').subscribe((data) => {
        expect(data.certifiedLinks).toEqual([])
        expect(data.moreServicesLinks).toEqual([])
        expect(data.loading).toBe(false)
        done()
      })

      const req = httpTestingController.expectOne(
        runtimeEnvironment.API_WEB +
          'workspace/retrieve-works-search-and-link-wizard.json'
      )
      req.flush([])
    })
  })
})

function getNumberOfWorks(numberOfContributors: number): Work[] {
  const works = []
  for (let i = 0; i < numberOfContributors; i++) {
    const work = getWork()
    work.title.value = work.title.value + ' ' + (i + 1)
    works.push(work)
  }
  return works
}

export function getWorksEndpoint(): WorksEndpoint {
  return {
    groups: [getWorkGroup()],
  } as WorksEndpoint
}

function getWorkGroup(): WorkGroup {
  return {
    activePutCode: 1,
    defaultPutCode: 1,
    works: [getWork()],
    activeVisibility: 'PUBLIC',
    externalIdentifiers: [],
  } as WorkGroup
}

export function getWork(): Work {
  return {
    title: {
      value: 'Book',
    },
    workType: {
      value: 'book',
    },
    putCode: {
      value: 1,
    },
    workExternalIdentifiers: [],
  } as Work
}
