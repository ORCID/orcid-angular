import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DeactivatedComponent } from './deactivated.component'

describe('DeactivatedComponent', () => {
  let component: DeactivatedComponent
  let fixture: ComponentFixture<DeactivatedComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeactivatedComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatedComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
