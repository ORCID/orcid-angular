import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EnvironmentBannerComponent } from './environment-banner.component'
import { WINDOW_PROVIDERS } from '../../cdk/window'
import { CookieService } from 'ngx-cookie-service'

describe('EnvironmentBannerComponent', () => {
  let component: EnvironmentBannerComponent
  let fixture: ComponentFixture<EnvironmentBannerComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentBannerComponent],
      providers: [WINDOW_PROVIDERS, CookieService],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentBannerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
