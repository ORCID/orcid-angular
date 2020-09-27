import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InfoDropDownComponent } from './info-drop-down.component'

describe('InfoDropDownComponent', () => {
  let component: InfoDropDownComponent
  let fixture: ComponentFixture<InfoDropDownComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoDropDownComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoDropDownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
