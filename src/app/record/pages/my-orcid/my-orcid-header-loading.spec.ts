import { take } from 'rxjs/operators'
import { RecordHeaderStateService } from 'src/app/core/record-header-state/record-header-state.service'
import { getUserRecord } from 'src/app/core/record/record.service.spec'
import { UserRecord } from 'src/app/types/record.local'
import { MyOrcidComponent } from './my-orcid.component'

describe('MyOrcidComponent header loading state', () => {
  let component: MyOrcidComponent
  let recordHeaderState: RecordHeaderStateService

  beforeEach(() => {
    recordHeaderState = new RecordHeaderStateService()
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
      recordHeaderState
    )
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
})
