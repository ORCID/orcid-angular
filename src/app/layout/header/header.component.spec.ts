import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HeaderComponent } from './header.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { A11yModule } from '@angular/cdk/a11y'
import { MatButtonModule } from '@angular/material/button'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { PlatformInfo } from '../../cdk/platform-info'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  const mobilePlatform = {
    columns12: false,
    columns8: false,
    columns4: true,
  } as unknown as PlatformInfo

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        A11yModule,
        HttpClientTestingModule,
        MatButtonModule,
        RouterTestingModule,
      ],
      declarations: [HeaderComponent],
      providers: [
        WINDOW_PROVIDERS,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        MatDialog,
        Overlay,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('hides the mobile search while the menu is open', () => {
    component.platform = mobilePlatform
    component.mobileMenuState = false
    component.isCompactActive = false
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('app-search')).toBeTruthy()

    component.mobileMenuState = true
    fixture.detectChanges()

    expect(fixture.nativeElement.querySelector('app-search')).toBeFalsy()
  })

  it('renders public nav items without a sign-in/register action', () => {
    component.platform = mobilePlatform
    component.mobileMenuState = true
    component.user = undefined
    fixture.detectChanges()

    const navButtons = fixture.nativeElement.querySelectorAll(
      'nav button'
    ) as NodeListOf<HTMLButtonElement>
    const buttonLabels = Array.from(navButtons).map(
      (button: HTMLButtonElement) =>
        button.textContent?.replace(/\s+/g, ' ').trim()
    )

    expect(buttonLabels[0]).toBe('ABOUT')
    expect(
      buttonLabels.some((label) => label?.includes('Sign in'))
    ).toBe(false)
  })

  it('sets active menu item id when a navigable item is clicked', () => {
    component.platform = {
      columns12: true,
    } as unknown as PlatformInfo
    const item = component.menu[0]
    spyOn(component, 'goto')

    component.click([], item)

    expect(component.activeMenuItemId).toBe(item.id)
    expect(component.goto).toHaveBeenCalledWith(item.route)
  })

  it('locks and restores body scroll while the mobile menu is open', () => {
    document.body.style.overflow = 'auto'

    component.setMobileMenuOpen(true)
    expect(document.body.style.overflow).toBe('hidden')

    component.setMobileMenuOpen(false)
    expect(document.body.style.overflow).toBe('auto')
  })

  it('applies the mobile overlay class when the mobile menu is open', () => {
    component.platform = mobilePlatform
    component.hideMainMenu = false
    component.mobileMenuState = true
    fixture.detectChanges()

    const nav = fixture.nativeElement.querySelector('nav')
    expect(nav?.classList.contains('mobile-nav-overlay')).toBe(true)
    expect(nav?.getAttribute('aria-modal')).toBe('true')
  })

  it('reports menu item active when route matches or item was clicked', () => {
    const item = component.menu[0]
    component.currentRoute = '/' + item.route
    expect(component.isMenuItemActive(item)).toBe(true)

    component.currentRoute = '/other'
    component.activeMenuItemId = item.id
    expect(component.isMenuItemActive(item)).toBe(true)
  })
})
