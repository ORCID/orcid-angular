import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TrustedIndividualsDropdownComponent } from './trusted-individuals-dropdown.component'

describe('TrustedIndividualsDropdownComponent', () => {
  let component: TrustedIndividualsDropdownComponent
  let fixture: ComponentFixture<TrustedIndividualsDropdownComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrustedIndividualsDropdownComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustedIndividualsDropdownComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
