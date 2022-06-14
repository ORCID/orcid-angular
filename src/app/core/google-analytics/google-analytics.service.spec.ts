import { TestBed } from '@angular/core/testing'

import { GoogleAnalyticsService } from './google-analytics.service'
import { WINDOW_PROVIDERS } from '../../cdk/window'

describe('GoogleAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [WINDOW_PROVIDERS]
  }))

  it('should be created', () => {
    const service: GoogleAnalyticsService = TestBed.inject(
      GoogleAnalyticsService
    )
    expect(service).toBeTruthy()
  })
})
