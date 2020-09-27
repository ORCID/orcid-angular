import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BannersComponent } from './banners.component'

describe('BannersComponent', () => {
  let component: BannersComponent
  let fixture: ComponentFixture<BannersComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannersComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
