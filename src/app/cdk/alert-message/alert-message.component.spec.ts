import { ComponentFixture, TestBed } from '@angular/core/testing'

import { AlertMessageComponent } from './alert-message.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('AlertMessageComponent', () => {
  let component: AlertMessageComponent
  let fixture: ComponentFixture<AlertMessageComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlertMessageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMessageComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
