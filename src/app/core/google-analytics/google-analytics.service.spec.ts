import { TestBed } from '@angular/core/testing'

import { GoogleUniversalAnalyticsService } from './google-universal-analytics.service'
import { WINDOW_PROVIDERS } from '../../cdk/window'

describe('GoogleAnalyticsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [WINDOW_PROVIDERS],
    })
  )

  it('should be created', () => {
    const service: GoogleUniversalAnalyticsService = TestBed.inject(
      GoogleUniversalAnalyticsService
    )
    expect(service).toBeTruthy()
  })
})
