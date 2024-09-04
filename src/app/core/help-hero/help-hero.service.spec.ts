import { TestBed } from '@angular/core/testing'
import { HelpHeroService } from './help-hero.service'
import { WINDOW_PROVIDERS } from '../../cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('HelpheroService', () => {
  let service: HelpHeroService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WINDOW_PROVIDERS],
    })
    service = TestBed.inject(HelpHeroService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
