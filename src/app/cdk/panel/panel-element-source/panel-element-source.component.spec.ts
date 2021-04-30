import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelElementSourceComponent } from './panel-element-source.component'

describe('PanelElementSourceComponent', () => {
  let component: PanelElementSourceComponent
  let fixture: ComponentFixture<PanelElementSourceComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelElementSourceComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelElementSourceComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
