import { TestBed } from '@angular/core/testing'
import { HelpHeroService } from './help-hero.service'

describe('HelpheroService', () => {
  let service: HelpHeroService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(HelpHeroService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
