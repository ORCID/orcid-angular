import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeComponent } from './home.component'
import { RouterTestingModule } from '@angular/router/testing'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { PlatformInfoService } from '../../../cdk/platform-info'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { TogglzService } from 'src/app/core/togglz/togglz.service'
import { WordpressService } from 'src/app/core/wordpress/wordpress.service'
import { of, Subject } from 'rxjs'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>
  let togglzState$: Subject<boolean>
  let wordpressService: jasmine.SpyObj<WordpressService>

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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
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
})
