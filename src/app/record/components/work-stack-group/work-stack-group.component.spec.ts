import { ComponentFixture, TestBed } from '@angular/core/testing'

import { WorkStackGroupComponent } from './work-stack-group.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { ErrorHandlerService } from '../../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { Overlay } from '@angular/cdk/overlay'
import { RecordService } from '../../../core/record/record.service'
import { RecordWorksService } from '../../../core/record-works/record-works.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { TogglzService } from '../../../core/togglz/togglz.service'
import { ADD_EVENT_ACTION } from '../../../constants'
import { of } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('WorkStackGroupComponent', () => {
  let component: WorkStackGroupComponent
  let fixture: ComponentFixture<WorkStackGroupComponent>
  let mockTogglzService: jasmine.SpyObj<TogglzService>
  let recordWorksService: RecordWorksService
  let matDialog: MatDialog

  beforeEach(async () => {
    mockTogglzService = jasmine.createSpyObj<TogglzService>('TogglzService', [
      'getStateOf',
    ])
    mockTogglzService.getStateOf.and.returnValue(of(true))

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule, RouterTestingModule],
      declarations: [WorkStackGroupComponent],
      providers: [
        WINDOW_PROVIDERS,
        RecordService,
        RecordWorksService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
        { provide: TogglzService, useValue: mockTogglzService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkStackGroupComponent)
    component = fixture.componentInstance
    component.isPublicRecord = 'orcid-id'
    recordWorksService = TestBed.inject(RecordWorksService)
    matDialog = TestBed.inject(MatDialog)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('when togglz certified/featured is true, searchAndLink add menu option has no modal', () => {
    const searchAndLinkOption = component.addMenuOptions.find(
      (opt) => opt.action === ADD_EVENT_ACTION.searchAndLink
    )
    expect(searchAndLinkOption).toBeDefined()
    expect(searchAndLinkOption!.modal).toBeUndefined()
  })

  it('onAddEvent(searchAndLink) opens ImportWorksDialogComponent with skeleton data and loads dialog data', () => {
    const openSpy = spyOn(matDialog, 'open').and.returnValue({
      componentInstance: { data: null },
      afterClosed: () => of(undefined),
    } as any)
    const skeleton = { loading: true, certifiedLinks: [], moreServicesLinks: [] }
    spyOn(recordWorksService, 'getImportWorksDialogDataSkeleton').and.returnValue(
      skeleton as any
    )
    spyOn(
      recordWorksService,
      'loadSearchAndLinkWizardDialogData'
    ).and.returnValue(of({ loading: false, certifiedLinks: [], moreServicesLinks: [] } as any))

    component.onAddEvent(ADD_EVENT_ACTION.searchAndLink)

    expect(recordWorksService.getImportWorksDialogDataSkeleton).toHaveBeenCalled()
    expect(matDialog.open).toHaveBeenCalledWith(
      jasmine.anything(),
      jasmine.objectContaining({
        data: skeleton,
        width: '850px',
        maxHeight: '90vh',
      })
    )
    expect(recordWorksService.loadSearchAndLinkWizardDialogData).toHaveBeenCalled()
  })

  it('onAddEvent(non-searchAndLink) does not open dialog', () => {
    const openSpy = spyOn(matDialog, 'open')

    component.onAddEvent(ADD_EVENT_ACTION.addManually)

    expect(openSpy).not.toHaveBeenCalled()
  })
})
