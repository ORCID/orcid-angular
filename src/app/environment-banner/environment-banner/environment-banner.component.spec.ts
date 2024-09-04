import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EnvironmentBannerComponent } from './environment-banner.component'
import { WINDOW_PROVIDERS } from '../../cdk/window'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('EnvironmentBannerComponent', () => {
  let component: EnvironmentBannerComponent
  let fixture: ComponentFixture<EnvironmentBannerComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentBannerComponent],
      providers: [WINDOW_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
