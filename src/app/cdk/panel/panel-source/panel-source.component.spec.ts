import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { PanelSourceComponent } from './panel-source.component'

describe('PanelSourceComponent', () => {
  let component: PanelSourceComponent
  let fixture: ComponentFixture<PanelSourceComponent>

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PanelSourceComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSourceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
