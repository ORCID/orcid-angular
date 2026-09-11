import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { Overlay } from '@angular/cdk/overlay'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { of, throwError } from 'rxjs'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { RecordCorrectionsService } from 'src/app/core/record-corrections/record-corrections.service'
import { RecordCorrectionsPage } from 'src/app/types/record-corrections.endpoint'
import { RecordCorrectionsComponent } from './record-corrections.component'

function pageWith(
  overrides: Partial<RecordCorrectionsPage> = {}
): RecordCorrectionsPage {
  return {
    haveNext: true,
    havePrevious: true,
    firstElementId: 1015,
    lastElementId: 1006,
    recordCorrections: [
      {
        sequence: 1015,
        sqlUsedToUpdate: 'update ...',
        description: 'Generate missing professional email domains',
        numChanged: 8090,
        type: 'python_script',
        dateCreated: Date.UTC(2026, 4, 18, 15, 24, 8),
        lastModified: Date.UTC(2026, 4, 18, 15, 24, 8),
      },
    ],
    ...overrides,
  }
}

describe('RecordCorrectionsComponent', () => {
  let component: RecordCorrectionsComponent
  let fixture: ComponentFixture<RecordCorrectionsComponent>
  let serviceSpy: jasmine.SpyObj<RecordCorrectionsService>

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('RecordCorrectionsService', [
      'getNextPage',
      'getPreviousPage',
    ])
    serviceSpy.getNextPage.and.returnValue(of(pageWith()))
    serviceSpy.getPreviousPage.and.returnValue(of(pageWith()))

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [RecordCorrectionsComponent],
      providers: [
        { provide: RecordCorrectionsService, useValue: serviceSpy },
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(RecordCorrectionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('loads the newest page without a cursor on init', () => {
    expect(serviceSpy.getNextPage).toHaveBeenCalledWith()
    expect(component.loading).toBeFalse()
  })

  it('renders a row per correction with the executed date formatted', () => {
    const cells = fixture.nativeElement.querySelectorAll('tbody tr td')
    expect(cells.length).toBe(3)
    expect(cells[0].textContent.trim()).toMatch(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/
    )
    expect(cells[1].textContent.trim()).toBe(
      'Generate missing professional email domains'
    )
    expect(cells[2].textContent.trim()).toBe('8090')
  })

  it('pages forward using the last element id', () => {
    component.next()
    expect(serviceSpy.getNextPage).toHaveBeenCalledWith(1006)
  })

  it('pages back using the first element id', () => {
    component.previous()
    expect(serviceSpy.getPreviousPage).toHaveBeenCalledWith(1015)
  })

  it('disables Previous on the first page', () => {
    serviceSpy.getNextPage.and.returnValue(
      of(pageWith({ havePrevious: false }))
    )
    component.ngOnInit()
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('#previous').disabled).toBeTrue()
    expect(fixture.nativeElement.querySelector('#next').disabled).toBeFalse()
  })

  it('disables Next on the last page', () => {
    serviceSpy.getNextPage.and.returnValue(of(pageWith({ haveNext: false })))
    component.ngOnInit()
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('#next').disabled).toBeTrue()
    expect(
      fixture.nativeElement.querySelector('#previous').disabled
    ).toBeFalse()
  })

  it('does not request a page when the button is disabled', () => {
    serviceSpy.getNextPage.and.returnValue(of(pageWith({ haveNext: false })))
    component.ngOnInit()
    serviceSpy.getNextPage.calls.reset()

    component.next()

    expect(serviceSpy.getNextPage).not.toHaveBeenCalled()
  })

  it('shows the empty state for the all-null page the backend returns past the last page', () => {
    serviceSpy.getNextPage.and.returnValue(
      of({
        haveNext: null,
        havePrevious: null,
        firstElementId: null,
        lastElementId: null,
        recordCorrections: null,
      })
    )
    component.ngOnInit()
    fixture.detectChanges()

    expect(component.isEmpty).toBeTrue()
    expect(fixture.nativeElement.querySelector('table')).toBeNull()
    expect(fixture.nativeElement.querySelector('.pagination')).toBeNull()
    expect(
      fixture.nativeElement.querySelector('.empty-message').textContent
    ).toContain('No corrections to report')
  })

  it('shows the error state and retries the last request', () => {
    serviceSpy.getNextPage.and.returnValue(throwError(() => new Error('boom')))
    component.ngOnInit()
    fixture.detectChanges()

    expect(component.error).toBeTrue()
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy()

    serviceSpy.getNextPage.and.returnValue(of(pageWith()))
    component.retry()
    fixture.detectChanges()

    expect(component.error).toBeFalse()
    expect(fixture.nativeElement.querySelector('table')).toBeTruthy()
  })
})
