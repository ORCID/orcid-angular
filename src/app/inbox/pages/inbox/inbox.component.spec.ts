import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InboxComponent } from './inbox.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('InboxComponent', () => {
  let component: InboxComponent
  let fixture: ComponentFixture<InboxComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboxComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
