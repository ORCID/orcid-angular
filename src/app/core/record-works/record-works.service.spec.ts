import { TestBed } from '@angular/core/testing'

import { RecordWorksService } from './record-works.service'

describe('RecordWorksService', () => {
  let service: RecordWorksService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(RecordWorksService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
