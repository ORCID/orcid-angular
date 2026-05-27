import { TestBed } from '@angular/core/testing'
import { take } from 'rxjs/operators'
import { getUserRecord } from '../record/record.service.spec'
import { RecordHeaderStateService } from './record-header-state.service'

describe('RecordHeaderStateService', () => {
  let service: RecordHeaderStateService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordHeaderStateService)
    service.reset()
  })

  it('should emit header loading separately from full record loading', (done) => {
    service.setLoadingUserRecord(true)
    service.setLoadingRecordHeader(false)

    service.loadingRecordHeader$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeFalse()
      done()
    })
  })

  it('should share the latest user record with header consumers', (done) => {
    const userRecord = getUserRecord()

    service.setUserRecord(userRecord)

    service.userRecord$.pipe(take(1)).subscribe((value) => {
      expect(value).toBe(userRecord)
      done()
    })
  })

  it('should reset header-specific state', (done) => {
    service.setLoadingRecordHeader(false)
    service.setUserRecord(getUserRecord())

    service.reset()

    service.loadingRecordHeader$.pipe(take(1)).subscribe((loading) => {
      expect(loading).toBeTrue()
      service.userRecord$.pipe(take(1)).subscribe((userRecord) => {
        expect(userRecord).toBeNull()
        done()
      })
    })
  })
})
