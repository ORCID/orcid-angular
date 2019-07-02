import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { MultiRowRaisedButtonComponent } from './multi-row-raised-button.component'

describe('MultiRowRaisedButtonComponent', () => {
  let component: MultiRowRaisedButtonComponent
  let fixture: ComponentFixture<MultiRowRaisedButtonComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiRowRaisedButtonComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiRowRaisedButtonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
