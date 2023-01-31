import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelDataLineComponent } from './panel-data-line.component'

describe('PanelDataLineComponent', () => {
  let component: PanelDataLineComponent
  let fixture: ComponentFixture<PanelDataLineComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PanelDataLineComponent],
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
