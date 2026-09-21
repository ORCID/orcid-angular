import { ComponentFixture, TestBed } from '@angular/core/testing'

import { RecordHeaderComponent } from './record-header.component'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RouterTestingModule } from '@angular/router/testing'
import { RecordService } from 'src/app/core/record/record.service'
import { MatTooltipModule } from '@angular/material/tooltip'
import { of } from 'rxjs'
import { HeaderCompactService } from 'src/app/core/header-compact/header-compact.service'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { UserService } from 'src/app/core'
import { getUserRecord } from 'src/app/core/record/record.service.spec'
import { getUserSession } from 'src/app/core/user/user.service.spec'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { TogglzFlag } from 'src/app/types/config.endpoint'
import { AffiliationType } from 'src/app/types/record-affiliation.endpoint'

describe('RecordHeaderComponent', () => {
  let component: RecordHeaderComponent
  let fixture: ComponentFixture<RecordHeaderComponent>
  let state: RecordHeaderStateService
  let recordService: jasmine.SpyObj<RecordService>
  let togglzService: { getStateOf: jasmine.Spy }

  beforeEach(async () => {
    recordService = jasmine.createSpyObj<RecordService>('RecordService', [
      'getRecord',
    ])
    togglzService = {
      getStateOf: jasmine
        .createSpy('getStateOf')
        .and.callFake((flag: string) =>
          of(flag === TogglzFlag.FEATURED_AFFILIATIONS)
        ),
    }

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        MatTooltipModule,
        RecordHeaderComponent,
      ],
      providers: [
        WINDOW_PROVIDERS,
        RecordHeaderStateService,
        { provide: RecordService, useValue: recordService },
        {
          provide: PlatformInfoService,
          useValue: { get: () => of({ columns12: true }) },
        },
        {
          provide: HeaderCompactService,
          useValue: { compactActive$: of(false) },
        },
        {
          provide: TogglzService,
          useValue: togglzService,
        },
        {
          provide: UserService,
          useValue: { getUserSession: () => of(getUserSession()) },
        },
        {
          provide: RumJourneyEventService,
          useValue: {
            recordSimpleEvent: jasmine.createSpy('recordSimpleEvent'),
          },
        },
      ],
    }).compileComponents()
  })

  beforeEach(() => {
    state = TestBed.inject(RecordHeaderStateService)
    state.reset()
    fixture = TestBed.createComponent(RecordHeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render header data from shared record state', () => {
    const userRecord = getUserRecord()
    const orcid = userRecord.userInfo.REAL_USER_ORCID

    state.setIsPublicRecord(orcid)
    state.setLoadingRecordHeader(false)
    state.setUserRecord(userRecord)
    fixture.detectChanges()

    const text = fixture.nativeElement.textContent
    expect(component.bannerTitle).toBe('Published Name')
    expect(text).toContain('Published Name')
    expect(text).toContain(`https:${runtimeEnvironment.BASE_URL}${orcid}`)
  })

  it('should not ask RecordService to load record data for the header', () => {
    state.setIsPublicRecord(getUserRecord().userInfo.REAL_USER_ORCID)
    state.setLoadingRecordHeader(false)
    state.setUserRecord(getUserRecord())
    fixture.detectChanges()

    expect(recordService.getRecord).not.toHaveBeenCalled()
  })

  it('should keep featured employment caption non-blocking', () => {
    const userRecord = getUserRecord()

    state.setIsPublicRecord(userRecord.userInfo.REAL_USER_ORCID)
    state.setLoadingRecordHeader(false)
    state.setUserRecord({ ...userRecord, affiliations: undefined })
    fixture.detectChanges()

    expect(component.loadingUserRecord).toBeFalse()
    expect(component.bannerTitle).toBe('Published Name')
    expect(component.bannerCaption).toBe('')
  })

  describe('records with no publicly available information', () => {
    function setUpEmptyRecord() {
      const userRecord = getUserRecord()

      state.setIsPublicRecord(userRecord.userInfo.REAL_USER_ORCID)
      state.setAffiliations(0)
      state.setDisplaySideBar(false)
      state.setDisplayBiography(false)
      state.setUserRecord({
        ...userRecord,
        names: undefined,
        otherNames: undefined,
        affiliations: [],
      })
      state.setLoadingRecordHeader(false)
      fixture.detectChanges()
    }

    it('should offer the record summary toggle', () => {
      setUpEmptyRecord()

      expect(component.noDisplayableData).toBeTrue()
      expect(component.canToggleRecordSummary).toBeTrue()
      expect(summaryToggleButton()).not.toBeNull()
      expect(summaryToggleButton().textContent).toContain('Show record summary')
    })

    it('should open the record summary when the toggle is clicked', () => {
      setUpEmptyRecord()

      let recordSummaryOpen: boolean
      state.recordSummaryOpen$.subscribe((open) => (recordSummaryOpen = open))

      summaryToggleButton().click()
      fixture.detectChanges()

      expect(recordSummaryOpen).toBeTrue()
      expect(summaryToggleButton().textContent).toContain('Hide record summary')
    })

    it('should keep the copy iD and print actions hidden', () => {
      setUpEmptyRecord()

      expect(
        fixture.nativeElement.querySelector('[header-banner-id-actions]')
      ).toBeNull()
    })

    it('should not offer the toggle when the record does not exist', () => {
      const userRecord = getUserRecord()

      state.setIsPublicRecord(userRecord.userInfo.REAL_USER_ORCID)
      state.setUserRecord({
        ...userRecord,
        userInfo: { ...userRecord.userInfo, USER_NOT_FOUND: true },
      })
      state.setLoadingRecordHeader(false)
      fixture.detectChanges()

      expect(component.canToggleRecordSummary).toBeFalse()
      expect(summaryToggleButton()).toBeNull()
    })
  })

  function summaryToggleButton(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.summary-actions-area button')
  }

  it('should render the featured employment caption from shared state', () => {
    const userRecord = getUserRecord()
    const featuredAffiliation =
      userRecord.affiliations[0].affiliationGroup[0].affiliations[0]

    featuredAffiliation.featured = true
    featuredAffiliation.affiliationType = { value: AffiliationType.employment }
    featuredAffiliation.roleTitle = { value: 'Engineer' }
    featuredAffiliation.departmentName = { value: 'Platform' }

    state.setIsPublicRecord(userRecord.userInfo.REAL_USER_ORCID)
    state.setLoadingRecordHeader(false)
    state.setUserRecord(userRecord)
    fixture.detectChanges()

    expect(component.bannerCaption).toBe(
      'ORCID: city, region, country - Engineer, Platform'
    )
  })
})
