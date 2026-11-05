import { TestBed } from '@angular/core/testing'

import { TitleService } from './title.service'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { NavigationEnd, Router } from '@angular/router'
import { Subject } from 'rxjs'

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

describe('TitleService route labels', () => {
  let title: Title
  let events: Subject<NavigationEnd>

  beforeEach(() => {
    events = new Subject<NavigationEnd>()
    TestBed.configureTestingModule({
      providers: [
        TitleService,
        Title,
        { provide: Router, useValue: { events: events.asObservable() } },
      ],
    })
    TestBed.inject(TitleService).init()
    title = TestBed.inject(Title)
    // Title writes straight to document.title, which outlives a single spec, so
    // a stale value would let these assertions pass without the service running.
    title.setTitle('untitled')
  })

  it('titles the record corrections page', () => {
    events.next(
      new NavigationEnd(1, '/record-corrections', '/record-corrections')
    )

    expect(title.getTitle()).toBe('Record corrections - ORCID')
  })

  it('titles the pre-migration record corrections URL the router redirects', () => {
    // The service matches on the requested URL, not the redirected one, so the
    // pre-migration path needs a label of its own.
    events.next(
      new NavigationEnd(
        1,
        '/about/trust/integrity/record-corrections',
        '/record-corrections'
      )
    )

    expect(title.getTitle()).toBe('Record corrections - ORCID')
  })
})
