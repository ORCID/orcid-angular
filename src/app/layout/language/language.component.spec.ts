import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LanguageComponent } from './language.component'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { MatDialog } from '@angular/material/dialog'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { PlatformInfoService } from '../../cdk/platform-info'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { LanguageService } from '../../core/language/language.service'
import { MatMenuModule } from '@angular/material/menu'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { PlatformInfo } from '../../cdk/platform-info'

describe('LanguageComponent', () => {
  let component: LanguageComponent
  let fixture: ComponentFixture<LanguageComponent>
  let platformSubject: BehaviorSubject<PlatformInfo>

  beforeEach(() => {
    ;(globalThis as any).runtimeEnvironment = {
      LANGUAGE_MENU_OPTIONS: { en: 'English' },
      debugger: false,
    }
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatMenuModule, RouterTestingModule],
      declarations: [LanguageComponent],
      providers: [
        WINDOW_PROVIDERS,
        LanguageService,
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
    fixture = TestBed.createComponent(LanguageComponent)
    component = fixture.componentInstance
    // Drive the platform through a subject so the async pipe marks the OnPush
    // view dirty on every emission, as it does in the running app.
    platformSubject = new BehaviorSubject({ columns12: true } as PlatformInfo)
    component.platform$ = platformSubject
    fixture.detectChanges()
  })

  function setPlatform(platform: Partial<PlatformInfo>) {
    platformSubject.next(platform as PlatformInfo)
    fixture.detectChanges()
  }

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders the language name on desktop and a globe icon below it', () => {
    expect(
      fixture.nativeElement.querySelector('button.orcid-button-light-grey')
    ).toBeTruthy()
    expect(fixture.nativeElement.textContent).toContain('English')

    setPlatform({ columns12: false })

    const iconButton = fixture.nativeElement.querySelector(
      'button.header-action-button'
    )
    expect(iconButton).toBeTruthy()
    expect(iconButton.querySelector('mat-icon').textContent.trim()).toBe(
      'language'
    )
  })
})
