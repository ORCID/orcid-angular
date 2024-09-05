import { TestBed } from '@angular/core/testing'

import { TitleService } from './title.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TitleServiceService', () => {
  let service: TitleService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TitleService,
          useValue: {},
        },
      ],
    })
    service = TestBed.inject(TitleService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
