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

describe('RecordHeaderComponent', () => {
  let component: RecordHeaderComponent
  let fixture: ComponentFixture<RecordHeaderComponent>
  let state: RecordHeaderStateService
  let recordService: jasmine.SpyObj<RecordService>

  beforeEach(async () => {
    recordService = jasmine.createSpyObj<RecordService>('RecordService', [
      'getRecord',
    ])

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
          useValue: { getStateOf: () => of(false) },
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
})
