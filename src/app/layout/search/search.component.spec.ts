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

describe('SearchComponent', () => {
  let component: SearchComponent
  let fixture: ComponentFixture<SearchComponent>

  beforeEach(() => {
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
})
