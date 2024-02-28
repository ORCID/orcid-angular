import { TestBed } from '@angular/core/testing'

import { WordpressService } from './wordpress.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { WINDOW_PROVIDERS } from 'src/app/cdk/window'

describe('WordpressService', () => {
  let service: WordpressService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [WINDOW_PROVIDERS, PlatformInfoService],
    })
    service = TestBed.inject(WordpressService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
