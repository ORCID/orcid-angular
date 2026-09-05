import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeComponent } from './home.component'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { WordpressService } from 'src/app/core/wordpress/wordpress.service'
import { HomepageContentService } from 'src/app/core/homepage-content/homepage-content.service'
import { HomepageContent } from 'src/app/types/homepage-content.v2'
import { of, Subject, throwError } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

function homepageContent(): HomepageContent {
  return {
    schemaVersion: 2,
    catalogueVersion: 1,
    page: { title: 'ORCID is for…', description: 'One sentence.' },
    sections: [
      {
        id: 'who-we-serve',
        type: 'audience-selector',
        variant: 'tabs-photo',
        layout: { span: 'full', spacing: 'normal', tone: 'brand-dark' },
        audiences: [
          {
            id: 'researchers',
            label: 'Researchers',
            intro: 'Intro',
            features: [
              { id: 'uniquely-yours', title: 'Uniquely Yours', body: 'Body' },
            ],
          },
        ],
      },
      {
        id: 'closing',
        type: 'prose',
        variant: 'default',
        layout: { span: 'full', spacing: 'normal', tone: 'default' },
        title: 'Integrate',
        body: 'Closing words.',
      },
    ],
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  let togglzState$: Subject<boolean>
  let wordpressService: jasmine.SpyObj<WordpressService>
  let homepageContentService: jasmine.SpyObj<HomepageContentService>

  beforeEach(() => {
    togglzState$ = new Subject<boolean>()
    wordpressService = jasmine.createSpyObj<WordpressService>(
      'WordpressService',
      [
        'getHomePageCSS',
        'getHomePagePost',
        'getHomePageJS',
        'getHomePageModulesJS',
      ]
    )
    wordpressService.getHomePageCSS.and.returnValue(
      of('body { color: black; }')
    )
    wordpressService.getHomePagePost.and.returnValue(
      of('<html><body><div>Homepage</div></body></html>')
    )
    wordpressService.getHomePageJS.and.returnValue(of('window.__home = true;'))
    wordpressService.getHomePageModulesJS.and.returnValue(
      of('window.__homeModules = true;')
    )

    homepageContentService = jasmine.createSpyObj<HomepageContentService>(
      'HomepageContentService',
      ['isEnabled', 'getContent']
    )
    // The default is the WordPress path, so the existing expectations below
    // describe the behaviour this change must leave alone.
    homepageContentService.isEnabled.and.returnValue(false)
    homepageContentService.getContent.and.returnValue(of(homepageContent()))

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, RouterTestingModule],
      declarations: [HomeComponent],
      providers: [
        WINDOW_PROVIDERS,
        {
          provide: PlatformInfoService,
          useValue: { get: () => of({ columns12: true }) },
        },
        {
          provide: TogglzService,
          useValue: { getStateOf: () => togglzState$ },
        },
        { provide: WordpressService, useValue: wordpressService },
        { provide: HomepageContentService, useValue: homepageContentService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  function create() {
    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  }

  beforeEach(() => {
    create()
  })

  it('should create', () => {
    togglzState$.next(false)
    togglzState$.complete()
    expect(component).toBeTruthy()
  })

  it('loads wordpress homepage once even if togglz emits multiple times', () => {
    togglzState$.next(true)
    togglzState$.next(true)
    togglzState$.complete()

    expect(wordpressService.getHomePageCSS).toHaveBeenCalledTimes(1)
    expect(wordpressService.getHomePagePost).toHaveBeenCalledTimes(1)
    expect(wordpressService.getHomePageJS).toHaveBeenCalledTimes(1)
    expect(wordpressService.getHomePageModulesJS).toHaveBeenCalledTimes(1)
  })

  describe('when the environment publishes JSON content', () => {
    beforeEach(() => {
      TestBed.resetTestingModule()
    })

    function createWithJsonContent(
      contentBehaviour: () => void = () =>
        homepageContentService.getContent.and.returnValue(of(homepageContent()))
    ) {
      homepageContentService.isEnabled.and.returnValue(true)
      contentBehaviour()

      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, RouterTestingModule],
        declarations: [HomeComponent],
        providers: [
          WINDOW_PROVIDERS,
          {
            provide: PlatformInfoService,
            useValue: { get: () => of({ columns12: true }) },
          },
          {
            provide: TogglzService,
            useValue: { getStateOf: () => togglzState$ },
          },
          { provide: WordpressService, useValue: wordpressService },
          { provide: HomepageContentService, useValue: homepageContentService },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      })

      create()
    }

    it('renders the content and never touches the WordPress path', () => {
      createWithJsonContent()

      expect(component.jsonMode).toBeTrue()
      expect(component.jsonContent?.page.title).toBe('ORCID is for…')
      expect(component.notWordpressDisplay).toBeFalsy()
      expect(wordpressService.getHomePagePost).not.toHaveBeenCalled()
      expect(wordpressService.getHomePageCSS).not.toHaveBeenCalled()

      const element = fixture.nativeElement as HTMLElement
      expect(element.querySelector('app-homepage-page')).toBeTruthy()
    })

    it('falls back to the static homepage when the content cannot be read', () => {
      createWithJsonContent(() =>
        homepageContentService.getContent.and.returnValue(
          throwError(() => new Error('unsupported schemaVersion'))
        )
      )

      expect(component.jsonMode).toBeFalse()
      expect(component.notWordpressDisplay).toBeTrue()
      expect(wordpressService.getHomePagePost).not.toHaveBeenCalled()

      fixture.detectChanges()
      const element = fixture.nativeElement as HTMLElement
      expect(element.querySelector('app-homepage-page')).toBeNull()
      expect(element.querySelector('.hero-header')).toBeTruthy()
    })

    it('asks the content service only once', () => {
      createWithJsonContent()
      expect(homepageContentService.getContent).toHaveBeenCalledTimes(1)
    })
  })
})
