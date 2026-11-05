import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Overlay } from '@angular/cdk/overlay'
import { MatSnackBar } from '@angular/material/snack-bar'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { RecordCorrectionsService } from './record-corrections.service'
import { RecordCorrectionsPage } from 'src/app/types/record-corrections.endpoint'

const API_WEB = 'https://test.orcid.org/'

describe('RecordCorrectionsService', () => {
  let service: RecordCorrectionsService
  let httpMock: HttpTestingController
  let originalEnvironment: any

  beforeEach(() => {
    // Other specs replace runtimeEnvironment wholesale, so set it per test
    // rather than once at module load, and put it back afterwards.
    originalEnvironment = (window as any).runtimeEnvironment
    ;(window as any).runtimeEnvironment = {
      ...originalEnvironment,
      API_WEB,
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [WINDOW_PROVIDERS, SnackbarService, MatSnackBar, Overlay],
    })
    service = TestBed.inject(RecordCorrectionsService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
    ;(window as any).runtimeEnvironment = originalEnvironment
  })

  it('requests the newest page when no cursor is given', () => {
    service.getNextPage().subscribe()
    httpMock.expectOne(API_WEB + 'record-corrections/next').flush({})
  })

  it('sends the last element id as the cursor when paging forward', () => {
    service.getNextPage(1006).subscribe()
    httpMock.expectOne(API_WEB + 'record-corrections/next/1006').flush({})
  })

  it('requests the previous page without a cursor', () => {
    service.getPreviousPage().subscribe()
    httpMock.expectOne(API_WEB + 'record-corrections/previous').flush({})
  })

  it('sends the first element id as the cursor when paging back', () => {
    service.getPreviousPage(1015).subscribe()
    httpMock.expectOne(API_WEB + 'record-corrections/previous/1015').flush({})
  })

  it('returns the page payload', (done) => {
    const page: RecordCorrectionsPage = {
      haveNext: true,
      havePrevious: false,
      firstElementId: 1015,
      lastElementId: 1006,
      recordCorrections: [
        {
          sequence: 1015,
          sqlUsedToUpdate: 'update ...',
          description: 'Generate missing professional email domains',
          numChanged: 8090,
          type: 'python_script',
          dateCreated: 1488326400000,
          lastModified: 1488326400000,
        },
      ],
    }

    service.getNextPage().subscribe((result) => {
      expect(result).toEqual(page)
      done()
    })

    httpMock.expectOne(API_WEB + 'record-corrections/next').flush(page)
  })

  it('reports an error through the error handler', (done) => {
    service.getNextPage().subscribe({
      next: () => done.fail('expected the request to fail'),
      error: () => done(),
    })

    httpMock
      .expectOne(API_WEB + 'record-corrections/next')
      .flush('failure', { status: 500, statusText: 'Server Error' })
  })
})
