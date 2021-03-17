import { ComponentFixture, TestBed } from '@angular/core/testing'

import { PanelPrivacyComponent } from './panel-privacy.component'

describe('PanelPrivacyComponent', () => {
  let component: PanelPrivacyComponent
  let fixture: ComponentFixture<PanelPrivacyComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PanelPrivacyComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelPrivacyComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
