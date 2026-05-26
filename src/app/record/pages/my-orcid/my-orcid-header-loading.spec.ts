import { take } from 'rxjs/operators'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { getUserRecord } from 'src/app/core/record/record.service.spec'
import { UserRecord } from 'src/app/types/record.local'
import { MyOrcidComponent } from './my-orcid.component'
import { RumJourneyEventService } from 'src/app/rum/service/customEvent.service'
import { AppEventName } from 'src/app/rum/app-event-names'
import { AffiliationType } from 'src/app/types/record-affiliation.endpoint'

describe('MyOrcidComponent header loading state', () => {
  let component: MyOrcidComponent
  let recordHeaderState: RecordHeaderStateService
  let rumEvents: jasmine.SpyObj<RumJourneyEventService>

  beforeEach(() => {
    recordHeaderState = new RecordHeaderStateService()
    rumEvents = jasmine.createSpyObj<RumJourneyEventService>('RumJourneyEventService', [
      'recordSimpleEvent',
    ])
    component = new MyOrcidComponent(
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      recordHeaderState,
      rumEvents
    )
    component.platform = { columns12: true } as any
    ;(component as any).headerRumStartTime = 100
  })

  it('should mark the record header ready before the full record is loaded', (done) => {
    const partialRecord = {
      ...getUserRecord(),
      works: undefined,
      fundings: undefined,
      peerReviews: undefined,
      researchResources: undefined,
    } as UserRecord

    component.publicOrcid = partialRecord.userInfo.REAL_USER_ORCID
    component.checkRecordHeaderLoadingState(partialRecord)
    component.checkLoadingState(partialRecord)

    recordHeaderState.loadingRecordHeader$
      .pipe(take(1))
      .subscribe((loading) => {
        expect(loading).toBeFalse()
        expect(component.loadingUserRecord).toBeTrue()
        done()
      })
  })

  it('should record the public header ready event once with elapsed time', () => {
    const partialRecord = {
      ...getUserRecord(),
      works: undefined,
      fundings: undefined,
      peerReviews: undefined,
      researchResources: undefined,
    } as UserRecord

    component.publicOrcid = partialRecord.userInfo.REAL_USER_ORCID
    spyOn(performance, 'now').and.returnValue(250)

    component.checkRecordHeaderLoadingState(partialRecord)
    component.checkRecordHeaderLoadingState(partialRecord)

    expect(rumEvents.recordSimpleEvent).toHaveBeenCalledTimes(1)
    expect(rumEvents.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.RecordHeaderPublicReady,
      jasmine.objectContaining({
        elapsed_ms: 150,
        has_record_issues: false,
        header_variant: 'public',
        is_desktop: true,
      })
    )
  })

  it('should not record the public header ready event for non-public records', () => {
    spyOn(performance, 'now').and.returnValue(250)

    component.checkRecordHeaderLoadingState(getUserRecord())

    expect(rumEvents.recordSimpleEvent).not.toHaveBeenCalledWith(
      AppEventName.RecordHeaderPublicReady,
      jasmine.anything()
    )
  })

  it('should record the featured employment caption event once when enabled', () => {
    const record = getUserRecord()
    record.affiliations[0].affiliationGroup[0].affiliations[0].featured = true
    record.affiliations[0].affiliationGroup[0].affiliations[0].affiliationType = {
      value: AffiliationType.employment,
    }

    component.publicOrcid = record.userInfo.REAL_USER_ORCID
    ;(component as any).featuredAffiliationsEnabled = true
    spyOn(performance, 'now').and.returnValue(275)

    ;(component as any).checkFeaturedEmploymentCaptionState(record)
    ;(component as any).checkFeaturedEmploymentCaptionState(record)

    expect(rumEvents.recordSimpleEvent).toHaveBeenCalledTimes(1)
    expect(rumEvents.recordSimpleEvent).toHaveBeenCalledWith(
      AppEventName.RecordHeaderFeaturedEmploymentCaptionLoaded,
      jasmine.objectContaining({
        caption_type: 'featured_employment',
        elapsed_ms: 175,
        has_record_issues: false,
        header_variant: 'public',
        is_desktop: true,
      })
    )
  })

  it('should not record the featured employment caption event when disabled', () => {
    const record = getUserRecord()
    record.affiliations[0].affiliationGroup[0].affiliations[0].featured = true

    component.publicOrcid = record.userInfo.REAL_USER_ORCID
    ;(component as any).featuredAffiliationsEnabled = false

    ;(component as any).checkFeaturedEmploymentCaptionState(record)

    expect(rumEvents.recordSimpleEvent).not.toHaveBeenCalledWith(
      AppEventName.RecordHeaderFeaturedEmploymentCaptionLoaded,
      jasmine.anything()
    )
  })
})
