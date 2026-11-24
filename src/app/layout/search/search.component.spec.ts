import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SearchComponent } from './search.component'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { TwoFactorAuthenticationService } from '../../core/two-factor-authentication/two-factor-authentication.service'
import { ErrorHandlerService } from '../../core/error-handler/error-handler.service'
import { PlatformInfoService } from '../../cdk/platform-info'
import { SnackbarService } from '../../cdk/snackbar/snackbar.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Overlay } from '@angular/cdk/overlay'
import { RouterTestingModule } from '@angular/router/testing'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { SearchService } from '../../core/search/search.service'
import { MatMenuModule } from '@angular/material/menu'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Subject } from 'rxjs'
import { TogglzService } from '../../core/togglz/togglz.service'
import { TogglzFlag } from '../../types/config.endpoint'

describe('SearchComponent', () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>
  let disableUiSearch$: Subject<boolean>
  let togglz: jasmine.SpyObj<TogglzService>

  beforeEach(() => {
    disableUiSearch$ = new Subject<boolean>()
    togglz = jasmine.createSpyObj('TogglzService', ['getStateOf'])
    togglz.getStateOf.and.returnValue(disableUiSearch$.asObservable())
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatMenuModule,
        RouterTestingModule,
        FormsModule,
      ],
      declarations: [SearchComponent],
      providers: [
        WINDOW_PROVIDERS,
        SearchService,
        PlatformInfoService,
        ErrorHandlerService,
        SnackbarService,
        MatSnackBar,
        Overlay,
        { provide: TogglzService, useValue: togglz },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('shows the form only when the search disable flag is false', () => {
    expect(togglz.getStateOf).toHaveBeenCalledWith(TogglzFlag.DISABLE_UI_SEARCH)
    expect(
      fixture.nativeElement.querySelector('form[role="search"]')
    ).toBeNull()

    disableUiSearch$.next(false)
    fixture.detectChanges()
    expect(
      fixture.nativeElement.querySelector('form[role="search"]')
    ).not.toBeNull()

    disableUiSearch$.next(true)
    fixture.detectChanges()
    expect(
      fixture.nativeElement.querySelector('form[role="search"]')
    ).toBeNull()

    disableUiSearch$.next(false)
    fixture.detectChanges()
    expect(
      fixture.nativeElement.querySelector('form[role="search"]')
    ).not.toBeNull()
  })

  it('keeps the form hidden when hideForm is set', () => {
    component.hideForm = true
    disableUiSearch$.next(false)
    fixture.detectChanges()
    expect(
      fixture.nativeElement.querySelector('form[role="search"]')
    ).toBeNull()
  })
})
