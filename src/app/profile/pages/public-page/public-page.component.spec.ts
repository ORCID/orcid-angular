import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PublicPageComponent } from './public-page.component'

describe('PublicPageComponent', () => {
  let component: PublicPageComponent
  let fixture: ComponentFixture<PublicPageComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PublicPageComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
