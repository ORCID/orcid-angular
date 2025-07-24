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
import { Config } from '../../types/togglz.endpoint'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

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

  fit('should call the method `save` 5 times and only `getWorks` and `getWorksGroupingSuggestions` once', () => {
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
        'works/worksExtendedPage.json?offset=0&sort=date&sortAsc=false&pageSize=50&featuredOnly=false'
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
