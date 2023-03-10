import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoggedInComponent } from './logged-in.component'
import { WINDOW_PROVIDERS } from '../../../cdk/window'
import { HttpClientModule } from '@angular/common/http'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { RouterModule } from '@angular/router'
import { SnackbarService } from 'src/app/cdk/snackbar/snackbar.service'
import { EMPTY } from 'rxjs'

describe('LoggedInComponent', () => {
  let component: LoggedInComponent
  let fixture: ComponentFixture<LoggedInComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoggedInComponent],
      providers: [
        WINDOW_PROVIDERS,
        {
          provide: PlatformInfoService,
          useValue: {},
        },
        {
          provide: RouterModule,
          useValue: {},
        },
        {
          provide: SnackbarService,
          useValue: {},
        },
        {
          provide: PlatformInfoService,
          useValue: {
            get: () => EMPTY,
          },
        },
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedInComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
