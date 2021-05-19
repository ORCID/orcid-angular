import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EnvironmentBannerComponent } from './environment-banner.component'

describe('EnvironmentBannerComponent', () => {
  let component: EnvironmentBannerComponent
  let fixture: ComponentFixture<EnvironmentBannerComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentBannerComponent],
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
