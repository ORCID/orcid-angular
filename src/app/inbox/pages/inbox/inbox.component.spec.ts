import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InboxComponent } from './inbox.component'

describe('InboxComponent', () => {
  let component: InboxComponent
  let fixture: ComponentFixture<InboxComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InboxComponent],
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
