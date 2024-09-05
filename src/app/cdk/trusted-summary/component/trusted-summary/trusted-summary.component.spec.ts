import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TrustedSummaryComponent } from './trusted-summary.component'
import { TrustedSummaryService } from 'src/app/core/trusted-summary/trusted-summary.service'
import { ErrorHandlerService } from 'src/app/core/error-handler/error-handler.service'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { PlatformInfoService } from 'src/app/cdk/platform-info'
import { of } from 'rxjs'
import { ZendeskService } from 'src/app/core/zendesk/zendesk.service'
import { WINDOW } from 'src/app/cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('TrustedSummaryComponent', () => {
  let component: TrustedSummaryComponent
  let fixture: ComponentFixture<TrustedSummaryComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrustedSummaryComponent],
      providers: [
        { provide: ErrorHandlerService, userValue: {} },
        {
          provide: TrustedSummaryService,
          useValue: { getSummary: () => of() },
        },
        { provide: PlatformInfoService, useValue: { get: () => of() } },
        {
          provide: ZendeskService,
          useValue: { hide: () => of() },
        },
        { provide: WINDOW, useValue: {} },
      ],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()

    fixture = TestBed.createComponent(TrustedSummaryComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
