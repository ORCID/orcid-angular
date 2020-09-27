import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LinkAccountComponent } from './link-account.component'

describe('LinkAccountComponent', () => {
  let component: LinkAccountComponent
  let fixture: ComponentFixture<LinkAccountComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkAccountComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkAccountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
