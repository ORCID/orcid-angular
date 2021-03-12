import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelDataComponent } from './panel-data.component'

describe('PanelDataComponent', () => {
  let component: PanelDataComponent
  let fixture: ComponentFixture<PanelDataComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PanelDataComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelDataComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
