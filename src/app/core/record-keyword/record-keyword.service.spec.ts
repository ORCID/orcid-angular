import { TestBed } from '@angular/core/testing'

import { RecordKeywordService } from './record-keyword.service'

describe('RecordKeywordService', () => {
  let service: RecordKeywordService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordKeywordService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
