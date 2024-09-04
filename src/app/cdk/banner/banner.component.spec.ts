import { ComponentFixture, TestBed } from '@angular/core/testing'

import { BannerComponent } from './banner.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('BannerComponent', () => {
  let component: BannerComponent
  let fixture: ComponentFixture<BannerComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
