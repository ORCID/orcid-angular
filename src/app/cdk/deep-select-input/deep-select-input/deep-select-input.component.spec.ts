import { ComponentFixture, TestBed } from '@angular/core/testing'

import { DeepSelectInputComponent } from './deep-select-input.component'

describe('DeepSelectInputComponent', () => {
  let component: DeepSelectInputComponent
  let fixture: ComponentFixture<DeepSelectInputComponent>

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeepSelectInputComponent],
    })
    fixture = TestBed.createComponent(DeepSelectInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
