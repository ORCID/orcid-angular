import { TestBed } from '@angular/core/testing'
import { LinkAccountGuard } from './link-account.guard'

describe('LinkAccountGuard', () => {
  let guard: LinkAccountGuard

  beforeEach(() => {
    TestBed.configureTestingModule({})
    guard = TestBed.inject(LinkAccountGuard)
  })

  it('should be created', () => {
    expect(guard).toBeTruthy()
  })
})
