import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelDataLineComponent } from './panel-data-line.component'

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('PanelDataLineComponent', () => {
  let component: PanelDataLineComponent
  let fixture: ComponentFixture<PanelDataLineComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PanelDataLineComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelDataLineComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
