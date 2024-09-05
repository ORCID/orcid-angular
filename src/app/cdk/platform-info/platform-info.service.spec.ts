import { TestBed } from '@angular/core/testing'

import { PlatformInfoService } from './platform-info.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../window'
import { Platform } from '@angular/cdk/platform'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PlatformInfoService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [WINDOW_PROVIDERS, PlatformInfoService],
    })
  )

  it('should be created', () => {
    const service: PlatformInfoService = TestBed.inject(PlatformInfoService)
    expect(service).toBeTruthy()
  })
})
