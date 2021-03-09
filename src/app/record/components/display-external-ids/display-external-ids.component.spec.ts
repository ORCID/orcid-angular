import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DisplayExternalIdsComponent } from './display-external-ids.component'

describe('DisplayExternalIdsComponent', () => {
  let component: DisplayExternalIdsComponent
  let fixture: ComponentFixture<DisplayExternalIdsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayExternalIdsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayExternalIdsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
