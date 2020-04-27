import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CustomEncoderComponent } from './custom-encoder.component'

describe('CustomEncoderComponent', () => {
  let component: CustomEncoderComponent
  let fixture: ComponentFixture<CustomEncoderComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomEncoderComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEncoderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
